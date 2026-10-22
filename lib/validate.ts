// Спільна валідація заявки: клієнт (LeadForm, Calculator) і Pages Function
export type LeadFields = { name: string; contact: string; business: string; comment: string; consent: boolean };
export type LeadErrors = Partial<Record<keyof LeadFields, string>>;

export const LIMITS = { name: 60, contact: 40, business: 200, comment: 1000 };

const TELEGRAM = /^@[A-Za-z0-9_]{5,32}$/;
const PHONE_CHARS = /^\+?[\d\s()-]+$/;

export function isContact(v: string): boolean {
  if (TELEGRAM.test(v)) return true;
  const digits = v.replace(/\D/g, '').length;
  return PHONE_CHARS.test(v) && digits >= 9 && digits <= 13;
}

export function validateLead(f: LeadFields): LeadErrors {
  const e: LeadErrors = {};
  const name = f.name.trim();
  if (name.length < 2 || name.length > LIMITS.name) e.name = "Вкажіть ім'я (2–60 символів).";
  if (!isContact(f.contact.trim())) e.contact = 'Вкажіть телефон у форматі +380… або Telegram @username.';
  if (f.business.trim().length > LIMITS.business) e.business = 'Не більше 200 символів.';
  if (f.comment.trim().length > LIMITS.comment) e.comment = 'Не більше 1000 символів.';
  if (f.consent !== true) e.consent = 'Потрібна згода з політикою конфіденційності.';
  return e;
}
