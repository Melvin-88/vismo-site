'use client';
import { Turnstile } from './Turnstile';
import { aria, FieldError, Honeypot, SubmitError, useLeadForm } from './useLeadForm';

const fields = (d: FormData) => ({
  name: String(d.get('name') || ''),
  contact: String(d.get('contact') || ''),
  business: String(d.get('business') || ''),
  comment: String(d.get('comment') || ''),
  consent: d.get('consent') === 'on',
});

export function LeadForm() {
  const { turnstile, errors, status, onStart, onSubmit } = useLeadForm('lead', fields);

  if (status === 'done') {
    return (
      <div role="status" className="rounded-[24px] bg-white p-8 text-center shadow-[var(--shadow-light)] sm:p-10">
        <div className="mx-auto flex w-fit items-center gap-2" aria-hidden="true">
          <span className="dot h-14 w-14 bg-lime" /><span className="dot h-7 w-7 bg-lime/70" /><span className="dot h-4 w-4 bg-lime/50" />
        </div>
        <h3 className="mt-6 text-[24px] font-extrabold">Дякуємо! Заявку отримали</h3>
        <p className="mx-auto mt-2 max-w-[24rem] text-[16px] leading-[1.55] text-gray-on-light">Звʼяжемося з вами протягом робочого дня.</p>
      </div>
    );
  }

  return (
    <form className="relative rounded-[24px] bg-white p-5 shadow-[var(--shadow-light)] sm:p-7" noValidate onSubmit={onSubmit} onFocus={onStart} aria-label="Заявка на безкоштовний розбір">
      <Honeypot />
      <div className="space-y-4">
        <div>
          <label htmlFor="f-name" className="mb-2 block text-[15px] font-bold">Ім&apos;я <span className="text-gray-on-light">*</span></label>
          <input id="f-name" name="name" className="field" autoComplete="name" required maxLength={60} {...aria('f-name', errors.name)} />
          <FieldError id="f-name-err" msg={errors.name} />
        </div>
        <div>
          <label htmlFor="f-contact" className="mb-2 block text-[15px] font-bold">Телефон або Telegram <span className="text-gray-on-light">*</span></label>
          <input id="f-contact" name="contact" className="field" autoComplete="tel" inputMode="tel" placeholder="+380… або @username" required maxLength={40} {...aria('f-contact', errors.contact)} />
          <FieldError id="f-contact-err" msg={errors.contact} />
        </div>
        <div>
          <label htmlFor="f-biz" className="mb-2 block text-[15px] font-bold">Ваш бізнес</label>
          <input id="f-biz" name="business" className="field" placeholder="посилання на Instagram або сайт" maxLength={200} {...aria('f-biz', errors.business)} />
          <FieldError id="f-biz-err" msg={errors.business} />
        </div>
        <div>
          <label htmlFor="f-comment" className="mb-2 block text-[15px] font-bold">Коментар</label>
          <textarea id="f-comment" name="comment" rows={3} className="field resize-none" maxLength={1000} {...aria('f-comment', errors.comment)} />
          <FieldError id="f-comment-err" msg={errors.comment} />
        </div>
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-[1.45]">
            <input type="checkbox" name="consent" className="check" required {...aria('f-consent', errors.consent)} />
            <span>Погоджуюсь з <a href="/privacy" className="font-bold underline underline-offset-2">політикою конфіденційності</a> <span className="text-gray-on-light">*</span></span>
          </label>
          <FieldError id="f-consent-err" msg={errors.consent} />
        </div>
      </div>
      <Turnstile ref={turnstile} />
      <button className="btn btn-primary mt-5 w-full" disabled={status === 'sending'}>
        {status === 'sending' ? 'Надсилаємо…' : 'Отримати розбір'}
      </button>
      <SubmitError status={status} />
    </form>
  );
}
