// npm test — валідація заявки і Pages Function з підміненим fetch
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLead, isContact } from './validate.ts';
import { onRequestPost } from '../functions/api/lead.ts';

const ok = { name: 'Роман', contact: '+380 99 061 5190', business: '', comment: '', consent: true };

test('контакт: телефон або Telegram', () => {
  for (const v of ['+380990615190', '099 061 51 90', '+38 (099) 061-51-90', '@vismo_agency']) assert.ok(isContact(v), v);
  for (const v of ['12345', '@abc', 'hello', '+38099061519000000', '@кирилиця']) assert.ok(!isContact(v), v);
});

test('validateLead', () => {
  assert.deepEqual(validateLead(ok), {});
  const e = validateLead({ name: 'Р', contact: 'x', business: 'a'.repeat(201), comment: '', consent: false });
  assert.deepEqual(Object.keys(e).sort(), ['business', 'consent', 'contact', 'name']);
});

const env = { TELEGRAM_BOT_TOKEN: 't', TELEGRAM_CHAT_ID: '1', TURNSTILE_SECRET_KEY: 's' };
const req = (body, type = 'application/json') =>
  new Request('https://x/api/lead', { method: 'POST', headers: { 'Content-Type': type }, body: JSON.stringify(body) });

function mockFetch({ turnstile = true } = {}) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('siteverify')) return Response.json({ success: turnstile, hostname: 'x' });
    return new Response('{"ok":true}');
  };
  return calls;
}

test('function: успішна заявка йде в Telegram з екрануванням і джерелом', async () => {
  const calls = mockFetch();
  const r = await onRequestPost({ request: req({ ...ok, name: '<b>Ро</b>', turnstile: 'tok', attribution: { utm_source: 'test', utm_campaign: 'check', gclid: 'x' } }), env });
  assert.equal(r.status, 200);
  const msg = JSON.parse(calls[1].init.body).text;
  assert.match(msg, /&lt;b&gt;Ро&lt;\/b&gt;/);
  assert.match(msg, /Джерело: test \/ check · gclid: так/);
});

test('function: honeypot — тихий успіх без відправки', async () => {
  const calls = mockFetch();
  const r = await onRequestPost({ request: req({ ...ok, website: 'spam' }), env });
  assert.equal(r.status, 200);
  assert.equal(calls.length, 0);
});

test('function: Turnstile, валідація, content-type, розмір', async () => {
  mockFetch({ turnstile: false });
  assert.equal((await onRequestPost({ request: req({ ...ok, turnstile: 'bad' }), env })).status, 403);
  mockFetch();
  assert.equal((await onRequestPost({ request: req({ ...ok, contact: 'nope', turnstile: 't' }), env })).status, 422);
  assert.equal((await onRequestPost({ request: req(ok, 'text/plain'), env })).status, 415);
  assert.equal((await onRequestPost({ request: req({ ...ok, comment: 'a'.repeat(11000) }), env })).status, 413);
  // кирилиця: 6000 символів < 10 КБ, але 12 000 байт > 10 КБ
  assert.equal((await onRequestPost({ request: req({ ...ok, comment: 'я'.repeat(6000) }), env })).status, 413);
});

test('function: токен Turnstile з іншого домену відхиляється', async () => {
  globalThis.fetch = async () => Response.json({ success: true, hostname: 'evil.example' });
  assert.equal((await onRequestPost({ request: req({ ...ok, turnstile: 't' }), env })).status, 403);
});
