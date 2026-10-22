import { Icon } from './ui/Icon';

const ITEMS = [
  'аудит поточної реклами й профілів;',
  'аналітика (GA4 + GTM);',
  'профіль у Google Картах;',
  'один рекламний канал на вибір — Google або Instagram/Facebook;',
  'заявки в таблицю чи месенджер із джерелом;',
  'щомісячний звіт простими словами.',
];
const PRICE_NOTE = 'Вартість рахуємо на безкоштовному розборі — під вашу нішу, канал і обсяг роботи.';

export function Package() {
  return (
    <section id="package" aria-labelledby="package-title" className="section-y !pt-0">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[28px] border-2 border-lime bg-graphite-2 p-6 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-16 hidden h-56 w-56 rounded-full bg-lime/[.06] lg:block" />
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-graphite-3 px-3 py-[6px] text-[13px] font-bold uppercase tracking-[.12em] text-lime">
              <span className="dot h-2 w-2 bg-lime" />Пакет
            </span>
            <h2 id="package-title" className="mt-4 text-[27px] font-extrabold leading-[1.2] lg:text-[42px]">«Система заявок»</h2>
            <p className="mt-4 text-[16px] leading-[1.55] text-gray lg:text-[18px]">Усе потрібне, щоб заявки приходили і було видно, що працює:</p>
            <p className="mt-8 hidden text-[16px] leading-[1.55] lg:block">{PRICE_NOTE}</p>
            <a href="#form" data-cta="package" className="btn btn-primary mt-6 hidden lg:inline-flex">Обговорити пакет</a>
          </div>
          <ul className="relative mt-6 space-y-[14px] lg:mt-1">
            {ITEMS.map(t => (
              <li key={t} className="flex gap-3 text-[16px] leading-[1.5] lg:text-[18px]">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-lime text-graphite"><Icon name="check" className="!h-4 !w-4 !stroke-[3]" /></span>{t}
              </li>
            ))}
          </ul>
          <p className="mt-7 text-[16px] leading-[1.55] lg:hidden">{PRICE_NOTE}</p>
          <a href="#form" data-cta="package" className="btn btn-primary mt-5 w-full lg:hidden">Обговорити пакет</a>
        </div>
      </div>
    </section>
  );
}
