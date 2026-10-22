// First-touch атрибуція (site-spec §8): записується один раз, далі не перезаписується
const KEY = 'vismo_attr';
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number] | 'landing_page' | 'referrer' | 'first_visit', string>>;

function fromUrl(): Attribution {
  const q = new URLSearchParams(location.search);
  const a: Attribution = {};
  for (const p of PARAMS) { const v = q.get(p); if (v) a[p] = v; }
  a.landing_page = location.pathname + location.search;
  a.referrer = document.referrer;
  a.first_visit = new Date().toISOString();
  return a;
}

export function captureAttribution() {
  try {
    if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify(fromUrl()));
  } catch { /* сховище недоступне — працюємо без нього */ }
}

export function getAttribution(): Attribution {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* див. вище */ }
  return fromUrl();
}
