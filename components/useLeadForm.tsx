'use client';
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { track, type ErrorType } from '@/lib/analytics';
import { sendLead } from '@/lib/lead';
import { CONTACTS } from '@/lib/site';
import { validateLead, type LeadErrors, type LeadFields } from '@/lib/validate';
import type { TurnstileHandle } from './Turnstile';

type Status = 'idle' | 'sending' | 'done' | ErrorType;

// Спільна логіка двох форм (головна + калькулятор): form_start, валідація, відправка, стани
export function useLeadForm(form: 'lead' | 'calc', toFields: (d: FormData) => LeadFields) {
  const turnstile = useRef<TurnstileHandle>(null);
  const started = useRef(false);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track({ event: 'form_start', form_id: form });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    const data = new FormData(el);
    const fields = toFields(data);
    const errs = validateLead(fields);
    setErrors(errs);
    if (Object.keys(errs).length) {
      track({ event: 'form_error', form_id: form, error_type: 'validation' });
      requestAnimationFrame(() => el.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setStatus('sending');
    const err = await sendLead({ ...fields, form, website: String(data.get('hp_extra') || ''), turnstile: turnstile.current?.token() || '' });
    if (err) turnstile.current?.reset();
    setStatus(err || 'done');
  }

  return { turnstile, errors, status, onStart, onSubmit };
}

// Приховане поле-пастка для ботів. Назва без сенсу, щоб автозаповнення браузера його не чіпало
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <input name="hp_extra" tabIndex={-1} autoComplete="new-password" />
    </div>
  );
}

// a11y-атрибути поля: зв'язок з помилкою
export const aria = (id: string, msg?: string) => ({ 'aria-invalid': msg ? true : undefined, 'aria-describedby': msg ? `${id}-err` : undefined });

export function FieldError({ id, msg, dark }: { id: string; msg?: string; dark?: boolean }) {
  return msg ? <p id={id} className={`mt-1.5 text-[14px] font-semibold ${dark ? 'text-error' : 'text-[#C62828]'}`}>{msg}</p> : null;
}

export function SubmitError({ status, dark }: { status: Status; dark?: boolean }) {
  if (status === 'idle' || status === 'sending' || status === 'done') return null;
  const why: Record<ErrorType, ReactNode> = {
    turnstile: 'Не вдалося підтвердити, що ви не робот. Спробуйте ще раз',
    validation: 'Перевірте, будь ласка, поля форми',
    network: 'Немає звʼязку із сервером',
    server: 'Не вдалося надіслати заявку',
  };
  const link = dark ? 'font-bold text-white underline' : 'font-bold underline';
  return (
    <p role="alert" className={`mt-4 text-[15px] leading-[1.5] ${dark ? 'text-error' : 'text-[#C62828]'}`}>
      {why[status]}. Напишіть нам в{' '}
      <a href={CONTACTS.instagram} target="_blank" rel="noopener noreferrer" data-contact="instagram" className={link}>Instagram</a>{' '}
      або зателефонуйте <a href={`tel:${CONTACTS.phone}`} data-contact="phone" className={`${link} whitespace-nowrap`}>{CONTACTS.phoneLabel}</a>.
    </p>
  );
}
