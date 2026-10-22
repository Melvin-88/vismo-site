'use client';
import { useState } from 'react';
import { Icon } from './ui/Icon';
import { Turnstile } from './Turnstile';
import { aria, FieldError, Honeypot, SubmitError, useLeadForm } from './useLeadForm';

// Калькулятор-хук: клієнт вводить цифри, розрахунок отримує менеджер разом із заявкою
const SLIDERS = [
  { k: 'budget', label: 'Бюджет на рекламу / міс', min: 2000, max: 100000, step: 1000, value: 15000 },
  { k: 'cpl', label: 'Ціна заявки', min: 20, max: 1500, step: 10, value: 150 },
  { k: 'conv', label: 'Із заявки в продаж', min: 5, max: 80, step: 1, value: 25 },
  { k: 'check', label: 'Середній чек', min: 200, max: 50000, step: 100, value: 3000 },
  { k: 'margin', label: 'Маржа', min: 5, max: 90, step: 1, value: 40 },
] as const;
type Key = (typeof SLIDERS)[number]['k'];
type Values = Record<Key, number>;

const n = (v: number) => Math.round(v).toLocaleString('uk-UA');
const fmt = (k: Key, v: number) => (k === 'conv' || k === 'margin' ? `${v}%` : `${n(v)} ₴`);

function summary(v: Values) {
  const leads = v.budget / v.cpl;
  const clients = leads * v.conv / 100;
  const profit = clients * v.check * v.margin / 100 - v.budget;
  const breakeven = v.check * v.margin / 100 * v.conv / 100;
  return `Калькулятор: бюджет ${fmt('budget', v.budget)}, заявка ${fmt('cpl', v.cpl)}, конверсія ${v.conv}%, чек ${fmt('check', v.check)}, маржа ${v.margin}%. ` +
    `Розрахунок: ~${n(leads)} заявок, ~${n(clients)} клієнтів, прибуток після реклами ${n(profit)} ₴, окупна ціна заявки до ${n(breakeven)} ₴.`;
}

export function Calculator() {
  const [v, setV] = useState<Values>(() => Object.fromEntries(SLIDERS.map(s => [s.k, s.value])) as Values);
  const [step, setStep] = useState<'calc' | 'form'>('calc');
  const { turnstile, errors, status, onStart, onSubmit } = useLeadForm('calc', d => ({
    name: String(d.get('name') || ''),
    contact: String(d.get('phone') || ''),
    business: String(d.get('ig') || ''),
    comment: [d.get('email') && `Email: ${d.get('email')}`, summary(v)].filter(Boolean).join('\n'),
    consent: d.get('consent') === 'on',
  }));

  const chips = (
    <div className="mt-4 flex flex-wrap gap-2 text-[13px] font-semibold">
      {[`бюджет ${fmt('budget', v.budget)}`, `заявка ${fmt('cpl', v.cpl)}`, `чек ${fmt('check', v.check)}`].map(t => (
        <span key={t} className="rounded-full bg-graphite-3 px-3 py-1">{t}</span>
      ))}
    </div>
  );

  return (
    <div id="calc" className="relative mx-auto w-full max-w-[480px]">
      <div className="mb-4 flex items-center justify-end gap-2 pr-2" aria-hidden="true">
        <span className="dot h-9 w-9 bg-lime lg:h-12 lg:w-12" /><span className="dot h-5 w-5 bg-lime lg:h-7 lg:w-7" /><span className="dot h-3 w-3 bg-lime lg:h-4 lg:w-4" />
      </div>
      <div className="rounded-[28px] border border-graphite-3 bg-graphite-2 p-5 lg:p-7">
        {status === 'done' ? (
          <div role="status" className="py-6 text-center">
            <div className="mx-auto flex w-fit items-center gap-2" aria-hidden="true">
              <span className="dot grid h-16 w-16 place-items-center bg-lime text-graphite"><Icon name="check" className="!h-8 !w-8 !stroke-[3]" /></span>
              <span className="dot h-8 w-8 bg-lime/70" /><span className="dot h-4 w-4 bg-lime/50" />
            </div>
            <p className="mt-6 text-[22px] font-extrabold">Дякуємо! Розрахунок уже в роботі</p>
            <p className="mx-auto mt-2 max-w-[22rem] text-[15px] leading-[1.5] text-gray">Менеджер звʼяжеться з вами протягом робочого дня й пройдеться по цифрах разом із вами.</p>
            <div className="flex justify-center">{chips}</div>
          </div>
        ) : step === 'calc' ? (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-gray">Калькулятор реклами</p>
                <p className="mt-1 text-[21px] font-extrabold leading-[1.25]">Скільки принесе реклама вашому бізнесу?</p>
              </div>
              <span className="mt-1 whitespace-nowrap rounded-full border border-dashed border-gray/60 px-3 py-1 text-[13px] font-semibold text-gray">ваші цифри</span>
            </div>
            <div className="mt-6 space-y-5">
              {SLIDERS.map(s => (
                <div key={s.k}>
                  <div className="flex items-baseline justify-between gap-3 text-[15px]">
                    <label htmlFor={`c-${s.k}`} className="text-gray">{s.label}</label>
                    <output htmlFor={`c-${s.k}`} data-out={s.k} className="text-[17px] font-extrabold">{fmt(s.k, v[s.k])}</output>
                  </div>
                  <input
                    type="range" id={`c-${s.k}`} data-k={s.k} className="range mt-2" min={s.min} max={s.max} step={s.step} value={v[s.k]}
                    style={{ '--p': `${((v[s.k] - s.min) / (s.max - s.min)) * 100}%` } as React.CSSProperties}
                    onChange={e => { const val = +e.target.value; setV(p => ({ ...p, [s.k]: val })); }}
                  />
                </div>
              ))}
            </div>
            {/* Результат навмисно закритий: його надсилає менеджер після заявки */}
            <div data-result className="relative mt-6 overflow-hidden rounded-2xl border border-lime/40 bg-lime/[.05] p-4">
              <div className="space-y-3 text-[14px]" aria-hidden="true">
                <div className="flex items-center justify-between"><span className="text-gray">Заявок на місяць</span><span className="h-4 w-14 rounded-full bg-white/25 blur-[3px]" /></div>
                <div className="flex items-center justify-between"><span className="text-gray">Нових клієнтів</span><span className="h-4 w-10 rounded-full bg-white/25 blur-[3px]" /></div>
                <div className="flex items-center justify-between"><span className="text-gray">Прибуток після реклами</span><span className="h-6 w-28 rounded-full bg-lime/60 blur-[4px]" /></div>
                <div className="flex items-center justify-between"><span className="text-gray">Яка ціна заявки окупається</span><span className="h-4 w-16 rounded-full bg-white/25 blur-[3px]" /></div>
              </div>
              <p className="mt-4 flex items-center gap-3 border-t border-lime/20 pt-3 text-[14px] font-semibold">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-lime text-graphite"><Icon name="lock" className="!h-4 !w-4" /></span>
                Розрахунок під ваші цифри надішле менеджер
              </p>
            </div>
            <button type="button" className="btn btn-primary mt-5 w-full" data-cta="hero" onClick={() => setStep('form')}>Розрахувати</button>
            <p className="mt-3 text-center text-[13px] text-gray">Безкоштовно й ні до чого не зобовʼязує.</p>
          </div>
        ) : (
          <form className="relative" noValidate onSubmit={onSubmit} onFocus={onStart} aria-label="Куди надіслати розрахунок">
            <Honeypot />
            <button type="button" className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-gray hover:text-white" onClick={() => setStep('calc')}>
              <Icon name="arrow" className="!h-5 !w-5 rotate-180" />Змінити цифри
            </button>
            <p className="mt-2 text-[21px] font-extrabold leading-[1.25]">Куди надіслати розрахунок?</p>
            <p className="mt-2 text-[15px] leading-[1.5] text-gray">Менеджер перевірить ваші цифри під нішу й канал і звʼяжеться з вами протягом робочого дня.</p>
            {chips}
            <div className="mt-5 space-y-3">
              <div>
                <label htmlFor="q-name" className="mb-1.5 block text-[14px] font-bold">Ім&apos;я <span className="text-gray">*</span></label>
                <input id="q-name" name="name" className="field field-dark" autoComplete="name" required maxLength={60} {...aria('q-name', errors.name)} />
                <FieldError dark id="q-name-err" msg={errors.name} />
              </div>
              <div>
                <label htmlFor="q-phone" className="mb-1.5 block text-[14px] font-bold">Телефон <span className="text-gray">*</span></label>
                <input id="q-phone" name="phone" className="field field-dark" type="tel" autoComplete="tel" required maxLength={40} {...aria('q-phone', errors.contact)} />
                <FieldError dark id="q-phone-err" msg={errors.contact} />
              </div>
              <div>
                <label htmlFor="q-email" className="mb-1.5 block text-[14px] font-bold">Email</label>
                <input id="q-email" name="email" className="field field-dark" type="email" autoComplete="email" maxLength={100} />
              </div>
              <div>
                <label htmlFor="q-ig" className="mb-1.5 block text-[14px] font-bold">Instagram або сайт</label>
                <input id="q-ig" name="ig" className="field field-dark" placeholder="@ваш_бізнес" maxLength={200} {...aria('q-ig', errors.business)} />
                <FieldError dark id="q-ig-err" msg={errors.business} />
              </div>
              <div>
                <label className="flex cursor-pointer items-start gap-3 pt-1 text-[14px] leading-[1.45] text-gray">
                  <input type="checkbox" name="consent" className="check check-dark" required {...aria('q-consent', errors.consent)} />
                  <span>Погоджуюсь з <a href="/privacy" className="font-bold text-white underline underline-offset-2">політикою конфіденційності</a> *</span>
                </label>
                <FieldError dark id="q-consent-err" msg={errors.consent} />
              </div>
            </div>
            <Turnstile ref={turnstile} />
            <button className="btn btn-primary mt-5 w-full" disabled={status === 'sending'}>
              {status === 'sending' ? 'Надсилаємо…' : 'Отримати розрахунок'}
            </button>
            <SubmitError dark status={status} />
          </form>
        )}
      </div>
    </div>
  );
}
