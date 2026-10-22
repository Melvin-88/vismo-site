/* eslint-disable @next/next/no-img-element */
import { FLAGS } from '@/lib/site';
import { Icon } from './ui/Icon';

const STEPS = [
  { title: 'Безкоштовний розбір', text: 'Дивимось ваш профіль, сайт або Instagram і рекламу. 15–20 хвилин.', badge: 'безкоштовно · 15–20 хв' },
  { title: 'Рахуємо економіку', text: 'Визначаємо, скільки можна платити за заявку, щоб реклама була вигідною.' },
  { title: 'Запускаємо', text: 'Спершу аналітика, потім реклама, далі заявки — у таблицю чи месенджер.' },
  { title: 'Звітуємо щомісяця', text: 'Витрати → заявки → ціна заявки → що робимо далі.' },
];
// Крапки-номери ростуть від кроку до кроку
// (mobile / desktop); TRAIL_LEFT = ширина крапки на desktop + 16px
const SIZE = [
  'h-9 w-9 text-[16px] lg:h-10 lg:w-10 lg:text-[17px]',
  'h-10 w-10 text-[17px] lg:h-12 lg:w-12 lg:text-[19px]',
  'h-12 w-12 text-[19px] lg:h-14 lg:w-14 lg:text-[21px]',
  'h-14 w-14 text-[21px] lg:h-16 lg:w-16 lg:text-[24px]',
];
const TRAIL_LEFT = ['left-[56px]', 'left-[64px]', 'left-[72px]'];

const Badge = ({ t }: { t?: string }) => t ? <span className="mt-2 inline-block rounded-full bg-lime/[.12] px-3 py-1 text-[14px] font-bold text-lime">{t}</span> : null;
const Dots = ({ sizes, cls }: { sizes: number[]; cls: string }) => <>{sizes.map((s, i) => <span key={i} className={`dot ${cls}`} style={{ width: s, height: s }} />)}</>;

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y !pt-0">
      <div className="container-x">
        <h2 id="process-title" className="text-[27px] font-extrabold leading-[1.2] lg:text-[42px]">Як ми працюємо</h2>

        {/* mobile: вертикальна лінія з крапками-номерами; desktop: горизонтальний ряд із «слідом» між кроками */}
        <ol className="mt-8 lg:mt-14 lg:grid lg:grid-cols-4 lg:gap-8">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`relative flex gap-4 lg:block ${i < 3 ? 'pb-8 lg:pb-0' : ''}`}>
              <div className="flex w-14 flex-none flex-col items-center lg:h-16 lg:w-auto lg:flex-row">
                <span data-step className={`dot grid place-items-center bg-lime font-black text-graphite ${SIZE[i]}`}>{i + 1}</span>
                {i < 3 && <span aria-hidden="true" data-vtrail className="mt-2 flex flex-1 flex-col items-center gap-[7px] lg:hidden"><Dots sizes={[4, 5, 6, 5, 4]} cls="bg-lime/40" /></span>}
              </div>
              {i < 3 && <div aria-hidden="true" data-htrail className={`absolute right-[-16px] top-0 hidden h-16 items-center justify-between lg:flex ${TRAIL_LEFT[i]}`}><Dots sizes={[4, 5, 6, 7, 8]} cls="self-center bg-lime/50" /></div>}
              <div>
                <h3 className="text-[20px] font-bold leading-[1.3] lg:mt-6 lg:text-[22px]">{s.title}</h3>
                <Badge t={s.badge} />
                <p className="mt-2 text-[16px] leading-[1.55] text-gray lg:mt-3">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={`mt-12 grid items-center gap-5 lg:mt-16 ${FLAGS.report ? 'lg:grid-cols-2' : 'lg:mx-auto lg:max-w-[720px]'}`}>
          <img src="/illustrations/ill-call.webp" width={1200} height={900} loading="lazy" decoding="async"
            alt="Безкоштовний онлайн-розбір реклами: власник бізнесу на відеодзвінку з маркетологом" className="h-auto w-full rounded-card" />
          {FLAGS.report && <Report />}
        </div>
      </div>
    </section>
  );
}

// Опційний блок «Приклад звіту» — умовні цифри, тому за замовчуванням вимкнений
function Report() {
  const funnel: [string, number, number, string, number, string][] = [
    ['Покази', 18, 7, '#4A4C52', 5, 'text-gray'],
    ['Кліки', 11, 9, '#6E7178', 6, 'text-gray'],
    ['Заявки', 6, 12, '#FFFFFF', 7, 'text-white'],
    ['Клієнти', 3, 16, '#C6F432', 8, 'font-bold text-lime'],
  ];
  return (
    <div className="relative w-full" role="img" aria-label="Приклад щомісячного звіту з умовними цифрами">
      <div className="relative rounded-[28px] border border-graphite-3 bg-graphite-2 p-5 lg:p-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[.12em] text-gray">Звіт · місяць</div>
            <div className="mt-1 text-[20px] font-bold">Ваш бізнес</div>
          </div>
          <span className="rounded-full border border-dashed border-gray/60 px-3 py-1 text-[13px] font-semibold text-gray">приклад звіту</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-graphite-3 px-3 py-[6px] text-[14px] font-semibold"><span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[12px] font-black text-[#4285F4]">G</span>Google Ads</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-graphite-3 px-3 py-[6px] text-[14px] font-semibold"><Icon name="instagram" className="!h-[18px] !w-[18px]" />Instagram</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-graphite-3 px-3 py-[6px] text-[14px] font-semibold"><Icon name="pin" className="!h-[18px] !w-[18px] text-[#EA4335]" />Карти</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-graphite-3 p-4"><div className="text-[14px] text-gray">Витрати</div><div className="mt-1 text-[24px] font-extrabold">9 600 ₴</div></div>
          <div className="rounded-2xl bg-graphite-3 p-4"><div className="text-[14px] text-gray">Заявки</div><div className="mt-1 text-[24px] font-extrabold">48</div></div>
          <div className="col-span-2 flex items-end justify-between rounded-2xl border border-lime/40 bg-[rgba(198,244,50,.07)] p-4">
            <div><div className="text-[14px] text-gray">Ціна заявки</div><div className="mt-1 text-[40px] font-black leading-none text-lime lg:text-[48px]">200 ₴</div></div>
            <span className="mb-1 text-[13px] font-semibold text-gray">умовні цифри</span>
          </div>
        </div>
        <div className="mt-5 space-y-3 border-t border-graphite-3 pt-5 text-[14px]">
          {funnel.map(([label, count, size, color, gap, cls]) => (
            <div key={label} className="flex items-center gap-3">
              <span className={`w-[68px] ${cls}`}>{label}</span>
              <span className="flex flex-1" style={{ gap }}>{Array.from({ length: count }, (_, i) => <span key={i} className="dot" style={{ width: size, height: size, background: color }} />)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
