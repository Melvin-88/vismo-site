// Спільна валідація заявки: клієнт (LeadForm, Calculator) і Pages Function
export const CHANNELS = { telegram: 'Telegram', viber: 'Viber', call: 'Дзвінок' } as const;
export type Channel = keyof typeof CHANNELS;

export type LeadFields = { name: string; contact: string; channel: string; business: string; comment: string; consent: boolean };
export type LeadErrors = Partial<Record<keyof LeadFields, string>>;

export const LIMITS = { name: 60, contact: 40, business: 200, comment: 1000 };

// Українські номери: місцева частина після +380 — рівно 9 цифр.
// Приймає +380…, 380…, 80…, 0… з будь-якими пробілами/дужками/дефісами.
function localDigits(v: string): string {
  let d = v.replace(/\D/g, '');
  if (d.startsWith('380')) d = d.slice(3);
  else if (d.startsWith('80')) d = d.slice(2);
  return d.replace(/^0/, '');
}

// Маска «+380 99 123 45 67» під час введення. Поки людина стирає префікс (+38, +3) — не заважаємо.
export function formatPhone(v: string): string {
  const raw = v.replace(/\D/g, '');
  if (!raw || '380'.startsWith(raw)) return raw ? '+' + raw : '';
  const d = localDigits(v).slice(0, 9);
  return ['+380', d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
}

// '+380991234567' або '' якщо номер неповний/зайвий
export function normalizePhone(v: string): string {
  const d = localDigits(v);
  return d.length === 9 ? '+380' + d : '';
}

export function validateLead(f: LeadFields): LeadErrors {
  const e: LeadErrors = {};
  const name = f.name.trim();
  if (name.length < 2 || name.length > LIMITS.name) e.name = "Вкажіть ім'я (2–60 символів).";
  if (f.contact.length > LIMITS.contact || !normalizePhone(f.contact)) e.contact = 'Вкажіть номер повністю: +380 99 123 45 67.';
  if (!Object.hasOwn(CHANNELS, f.channel)) e.channel = 'Оберіть, як з вами звʼязатися.';
  if (f.business.trim().length > LIMITS.business) e.business = 'Не більше 200 символів.';
  if (f.comment.trim().length > LIMITS.comment) e.comment = 'Не більше 1000 символів.';
  if (f.consent !== true) e.consent = 'Потрібна згода з політикою конфіденційності.';
  return e;
}
