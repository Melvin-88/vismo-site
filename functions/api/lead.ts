// Cloudflare Pages Function: POST /api/lead → Turnstile → валідація → Telegram. Заявки ніде не зберігаються.
import { CHANNELS, LIMITS, normalizePhone, validateLead, type Channel } from '../../lib/validate.ts';

interface Env { TELEGRAM_BOT_TOKEN: string; TELEGRAM_CHAT_ID: string; TURNSTILE_SECRET_KEY: string }

const MAX_BODY = 10 * 1024;
const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'landing_page', 'referrer'];

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// токен має бути виданий саме на тому домені, куди прийшов запит (не з копії сайту з тим самим ключем)
async function turnstileOk(token: string, secret: string, ip: string | null, host: string) {
  const body = new URLSearchParams({ secret: secret.trim(), response: token });
  if (ip) body.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const d = (await r.json()) as { success?: boolean; hostname?: string; 'error-codes'?: string[] };
  const ok = d.success === true && d.hostname === host;
  // без секретів у лозі: лише коди помилок і хости, щоб бачити причину відмови в Real-time logs
  if (!ok) console.error('lead: turnstile', JSON.stringify(d['error-codes'] || []), d.hostname, host);
  return ok;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  try {
    if (!(request.headers.get('Content-Type') || '').includes('application/json')) return json({ ok: false, error: 'validation' }, 415);
    // спершу заголовок, щоб не читати в памʼять великі тіла; потім реальний розмір у байтах (кирилиця — 2 байти)
    if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY) return json({ ok: false, error: 'validation' }, 413);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY) return json({ ok: false, error: 'validation' }, 413);

    let b: Record<string, unknown>;
    try { b = JSON.parse(raw); } catch { return json({ ok: false, error: 'validation' }, 400); }
    if (!b || typeof b !== 'object') return json({ ok: false, error: 'validation' }, 400);

    // honeypot: боту відповідаємо «успіх», нічого не надсилаючи
    if (str(b.website, 200)) return json({ ok: true });

    if (!env.TURNSTILE_SECRET_KEY || !env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      console.error('lead: missing env secrets');
      return json({ ok: false, error: 'server' }, 500);
    }
    if (!(await turnstileOk(str(b.turnstile, 2048), env.TURNSTILE_SECRET_KEY, request.headers.get('CF-Connecting-IP'), new URL(request.url).hostname)))
      return json({ ok: false, error: 'turnstile' }, 403);

    const f = {
      name: str(b.name, LIMITS.name),
      contact: str(b.contact, LIMITS.contact),
      channel: str(b.channel, 20),
      business: str(b.business, LIMITS.business),
      comment: str(b.comment, LIMITS.comment),
      consent: b.consent === true,
    };
    if (Object.keys(validateLead(f)).length) return json({ ok: false, error: 'validation' }, 422);

    const a = (b.attribution && typeof b.attribution === 'object' ? b.attribution : {}) as Record<string, unknown>;
    const at = Object.fromEntries(ATTR_KEYS.map(k => [k, str(a[k], 300)]));
    const source = [at.utm_source || 'direct', at.utm_medium, at.utm_campaign].filter(Boolean).join(' / ');
    const clickIds = [at.gclid && 'gclid: так', at.fbclid && 'fbclid: так'].filter(Boolean).join(' · ');
    const when = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv', dateStyle: 'short', timeStyle: 'short' });

    const text = [
      `🟢 <b>Нова заявка — vismo.com.ua</b>${b.form === 'calc' ? ' (калькулятор)' : ''}`,
      `Ім'я: ${esc(f.name)}`,
      `Телефон: ${normalizePhone(f.contact)}`,
      `Звʼязок: ${CHANNELS[f.channel as Channel]}${f.channel === 'telegram' ? ` · <a href="https://t.me/${normalizePhone(f.contact)}">написати</a>` : ''}`,
      f.business && `Бізнес: ${esc(f.business)}`,
      f.comment && `Коментар: ${esc(f.comment)}`,
      `Джерело: ${esc(source)}${clickIds ? ' · ' + clickIds : ''}`,
      `Сторінка входу: ${esc(at.landing_page || '/')} · ${when}`,
      at.referrer && `Referrer: ${esc(at.referrer)}`,
    ].filter(Boolean).join('\n');

    const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true } }),
    });
    if (!tg.ok) {
      console.error('lead: telegram', tg.status, await tg.text());
      return json({ ok: false, error: 'server' }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error('lead: unexpected', err);
    return json({ ok: false, error: 'server' }, 500);
  }
}
