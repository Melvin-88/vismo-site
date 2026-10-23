'use client';
import { type FormEvent } from 'react';
import { CHANNELS, formatPhone } from '@/lib/validate';
import { aria, FieldError } from './useLeadForm';

// Телефон з маскою +380 + вибір каналу. Маска форматує лише коли курсор у кінці,
// щоб правка всередині номера не стрибала курсором (типова проблема масок, див. Baymard).
export function PhoneField({ id, error, channelError, dark }: { id: string; error?: string; channelError?: string; dark?: boolean }) {
  const onInput = (e: FormEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    if (el.selectionStart === el.value.length) el.value = formatPhone(el.value);
  };
  const onFocus = (e: FormEvent<HTMLInputElement>) => { if (!e.currentTarget.value) e.currentTarget.value = '+380 '; };
  const onBlur = (e: FormEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    el.value = /^\+?3?8?0?\s*$/.test(el.value) ? '' : formatPhone(el.value);
  };
  const label = dark ? 'mb-1.5 block text-[14px] font-bold' : 'mb-2 block text-[15px] font-bold';
  const star = dark ? 'text-gray' : 'text-gray-on-light';
  const pill = dark
    ? 'border-graphite-3 bg-graphite-3 text-white has-[:checked]:border-lime has-[:checked]:bg-lime has-[:checked]:text-graphite'
    : 'border-[#E2E2DE] bg-off-white has-[:checked]:border-graphite has-[:checked]:bg-graphite has-[:checked]:text-white';

  return (
    <>
      <div>
        <label htmlFor={id} className={label}>Телефон <span className={star}>*</span></label>
        <input id={id} name="contact" type="tel" inputMode="tel" autoComplete="tel" placeholder="+380 99 123 45 67" required maxLength={40}
          className={`field${dark ? ' field-dark' : ''}`} onInput={onInput} onFocus={onFocus} onBlur={onBlur} {...aria(id, error)} />
        <FieldError dark={dark} id={`${id}-err`} msg={error} />
      </div>
      <fieldset>
        <legend className={label}>Як зручніше звʼязатися?</legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CHANNELS).map(([k, t]) => (
            <label key={k} className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-full border-[1.5px] px-4 text-[15px] font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lime ${pill}`}>
              <input type="radio" name="channel" value={k} defaultChecked={k === 'telegram'} className="sr-only" />{t}
            </label>
          ))}
        </div>
        <FieldError dark={dark} id={`${id}-ch-err`} msg={channelError} />
      </fieldset>
    </>
  );
}
