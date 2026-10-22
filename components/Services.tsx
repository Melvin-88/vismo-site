import type { ReactNode } from 'react';
import { FLAGS } from '@/lib/site';
import { Icon } from './ui/Icon';

// Мініатюри-сценки в картках: декор (aria-hidden), текст несуть h3 і p
const GoogleMock = () => (
  <>
    <div className="absolute inset-x-4 top-4 flex h-10 items-center gap-2 rounded-full bg-graphite-2 px-4 text-[14px]"><Icon name="search" className="!h-4 !w-4 text-gray" /><span>ремонт пральних машин</span><span className="ml-[-6px] h-4 w-[2px] bg-lime" /></div>
    <div className="absolute inset-x-4 top-[66px] rounded-xl bg-graphite-2 p-3 ring-1 ring-lime/50">
      <div className="flex items-center gap-2 text-[12px]"><b>Реклама</b><span className="text-gray">· ваш-сайт.ua</span></div>
      <div className="mt-1 text-[15px] font-bold text-lime">Ремонт за 1 день — виїзд майстра</div>
      <div className="mt-1.5 h-2 w-4/5 rounded-full bg-graphite-3" />
    </div>
    <svg className="absolute bottom-3 right-6 h-6 w-6 drop-shadow" viewBox="0 0 24 24"><path d="M4 2l15 8.5-6.4 1.6L9.5 18z" fill="#fff" stroke="#1E1F22" strokeWidth="1.5" strokeLinejoin="round" /></svg>
  </>
);

const InstaMock = () => (
  <>
    <div className="absolute left-4 top-4 w-[150px] overflow-hidden rounded-xl bg-graphite-2">
      <div className="flex items-center gap-2 p-2 text-[11px]"><span className="dot grid h-5 w-5 place-items-center bg-[#E9E2D6] text-[10px] font-black text-[#3E5A4C]">U</span><div><b>urban.wear</b><div className="text-[10px] text-gray">Реклама</div></div></div>
      <div className="relative h-[62px] overflow-hidden"><svg viewBox="0 0 200 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full"><rect width="200" height="160" fill="#E9E2D6" /><circle cx="160" cy="34" r="46" fill="#F2ECE2" /><path d="M64 46 L100 30 L136 46" stroke="#8B857A" strokeWidth="3" fill="none" /><path d="M72 44 Q100 30 128 44 L156 70 L145 86 L134 78 L134 140 Q100 147 66 140 L66 78 L55 86 L44 70 Z" fill="#3E5A4C" /><path d="M84 42 Q100 64 116 42 Q100 34 84 42Z" fill="#2E463A" /><rect x="81" y="100" width="38" height="22" rx="6" fill="#36503F" /></svg></div>
      <div className="m-2 rounded-md bg-white py-1 text-center text-[11px] font-bold text-graphite">Написати</div>
    </div>
    <div className="absolute right-4 top-6 max-w-[150px] rounded-2xl rounded-br-md bg-lime px-3 py-2 text-[13px] font-semibold leading-snug text-graphite">Добрий день! Скільки коштує?</div>
    <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-graphite-2 px-3 py-1.5 text-[12px]"><span className="dot h-2 w-2 bg-lime" />нова заявка</div>
  </>
);

const MapsMock = () => (
  <>
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 168" preserveAspectRatio="xMidYMid slice"><g stroke="#3A3C42" strokeWidth="10" fill="none" strokeLinecap="round"><path d="M-10 40 L310 70" /><path d="M90 -10 L120 180" /><path d="M200 -10 L230 180" /><path d="M-10 130 L310 110" /></g><g stroke="#34363B" strokeWidth="4" fill="none"><path d="M-10 95 L310 90" /><path d="M40 -10 L60 180" /></g></svg>
    <div className="absolute left-[46%] top-[18px]"><span className="dot absolute -left-3 -top-3 h-[52px] w-[52px] bg-lime/20" /><svg className="relative h-7 w-7 text-lime" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a8 8 0 0 0-8 8c0 5 5.5 10.2 7.4 11.8a1 1 0 0 0 1.2 0C14.5 20.2 20 15 20 10a8 8 0 0 0-8-8m0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6" /></svg></div>
    <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2 rounded-xl bg-graphite-2 p-3">
      <div><div className="text-[14px] font-bold">Ваш бізнес</div><div className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[12px] text-gray"><span className="tracking-[1px] text-lime">★★★★★</span>4,9 · відкрито</div></div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-[12px] font-bold text-graphite"><Icon name="phone" className="!h-3.5 !w-3.5" />Дзвінок</span>
    </div>
  </>
);

const AnalyticsMock = () => (
  <>
    <div className="absolute left-4 top-4 text-[12px] text-gray">Заявки за джерелами</div>
    <div className="absolute left-4 top-11 w-[44%] space-y-2.5 text-[12px]">
      {([['Google', 14, 'w-[88%] bg-lime'], ['Instagram', 11, 'w-[70%] bg-lime/70'], ['Карти', 6, 'w-[40%] bg-lime/45']] as const).map(([l, v, c]) => (
        <div key={l}><div className="flex justify-between"><span>{l}</span><b>{v}</b></div><div className="mt-1 h-1.5 rounded-full bg-graphite-2"><div className={`h-full rounded-full ${c}`} /></div></div>
      ))}
    </div>
    <svg className="absolute bottom-4 right-4 h-[110px] w-[44%]" viewBox="0 0 200 110" preserveAspectRatio="none"><path d="M0 95 L35 80 L70 86 L105 55 L140 60 L175 28 L200 18 L200 110 L0 110Z" fill="rgb(198 244 50 / .12)" /><path d="M0 95 L35 80 L70 86 L105 55 L140 60 L175 28 L200 18" fill="none" stroke="#C6F432" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" /><circle cx="175" cy="28" r="5" fill="#C6F432" /></svg>
    <span className="absolute right-4 top-4 rounded-full border border-dashed border-gray/50 px-2 text-[11px] text-gray">приклад</span>
  </>
);

const SiteMock = () => (
  <>
    <div className="absolute inset-x-4 bottom-0 top-4 overflow-hidden rounded-t-xl bg-graphite-2">
      <div className="flex items-center gap-1.5 border-b border-graphite-3 px-3 py-2"><span className="dot h-2 w-2 bg-gray/50" /><span className="dot h-2 w-2 bg-gray/50" /><span className="dot h-2 w-2 bg-gray/50" /><span className="ml-2 h-3 w-28 rounded-full bg-graphite-3" /></div>
      <div className="grid grid-cols-[1.2fr_1fr] gap-4 p-4">
        <div><div className="h-3 w-full rounded-full bg-white/80" /><div className="mt-2 h-3 w-3/4 rounded-full bg-white/80" /><div className="mt-3 h-2 w-full rounded-full bg-graphite-3" /><div className="mt-1.5 h-2 w-2/3 rounded-full bg-graphite-3" /><div className="mt-4 h-6 w-24 rounded-full bg-lime" /></div>
        <div className="space-y-2 rounded-lg bg-graphite-3 p-2.5"><div className="h-4 rounded bg-graphite-2" /><div className="h-4 rounded bg-graphite-2" /><div className="h-4 rounded bg-lime/80" /></div>
      </div>
    </div>
    <div className="absolute right-3 top-[86px] flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[12px] font-bold text-graphite shadow-lg"><span className="dot h-2.5 w-2.5 bg-[#9CCB0E]" />Нова заявка · з сайту</div>
  </>
);

const ContentMock = () => (
  <>
    <div className="absolute bottom-3 left-4 top-3 w-[96px] overflow-hidden rounded-xl bg-[#3A3C42]">
      <span className="dot absolute left-1/2 top-[38%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 bg-lime/80" />
      <span className="dot absolute left-[64%] top-[22%] h-6 w-6 bg-lime/50" />
      <div className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-white/25"><div className="h-full w-2/3 rounded-full bg-white" /></div>
      <span className="absolute left-2 top-2 rounded-md bg-graphite/70 px-1.5 text-[10px] font-bold">Reels</span>
    </div>
    <div className="absolute left-[128px] right-4 top-4 space-y-2">
      <div className="flex items-center gap-2"><span className="rounded-full bg-lime px-2.5 py-1 text-[12px] font-extrabold text-graphite">AI</span><span className="text-[13px] font-semibold">креативи для реклами</span></div>
      <div className="flex gap-1.5"><span className="h-12 flex-1 rounded-lg bg-graphite-2" /><span className="h-12 flex-1 rounded-lg bg-graphite-2 ring-2 ring-lime" /><span className="h-12 flex-1 rounded-lg bg-graphite-2" /></div>
      <div className="flex items-center gap-2 text-[12px] text-gray"><Icon name="check" className="!h-4 !w-4 text-lime" />фото · відео · тексти</div>
    </div>
  </>
);

const SERVICES: { title: string; text: string; mock: ReactNode; on?: boolean }[] = [
  { title: 'Google Ads', text: 'Контекстна реклама в пошуку: показуємо вас людям, які вже шукають вашу послугу в Google.', mock: <GoogleMock /> },
  { title: 'Таргетована реклама в Instagram і Facebook', text: 'Заявки через форму, сайт або Direct — з тестом кількох креативів.', mock: <InstaMock /> },
  { title: 'Google Карти (профіль компанії)', text: 'Щоб вас знаходили поруч, бачили відгуки й одразу телефонували.', mock: <MapsMock /> },
  { title: 'Аналітика', text: 'GA4 і Google Tag Manager: видно, звідки кожна заявка і скільки вона коштує.', mock: <AnalyticsMock /> },
  { title: 'Сайти й лендинги будь-якої складності', text: 'Швидкі сторінки під заявки: тексти, форма, аналітика й технічна SEO-основа одразу.', mock: <SiteMock /> },
  { title: 'Контент і креативи', text: 'Контент-мейкери та AI-контент: Reels, фото й відео для реклами та соцмереж.', mock: <ContentMock />, on: FLAGS.contentService },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y !pt-0">
      <div className="container-x">
        <h2 id="services-title" className="text-[27px] font-extrabold leading-[1.2] lg:text-[42px]">Що ми робимо</h2>
        <div className="mt-7 grid gap-3 lg:mt-10 lg:grid-cols-6 lg:gap-5">
          {SERVICES.filter(s => s.on !== false).map((s, i, all) => (
            // 5 карток: дві останні розтягуємо на пів ряду, щоб сітка не мала дірки
            <article key={s.title} className={`rounded-card bg-graphite-2 p-6 lg:p-7 ${all.length === 5 && i >= 3 ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
              <div className="relative mb-5 h-[168px] overflow-hidden rounded-2xl bg-graphite-3" aria-hidden="true">{s.mock}</div>
              <h3 className="text-[20px] font-bold leading-[1.3] lg:text-[23px]">{s.title}</h3>
              <p className="mt-2 text-[16px] leading-[1.55] text-gray">{s.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 flex max-w-[44rem] gap-3 text-[14px] leading-[1.5] text-gray lg:text-[15px]">
          <span className="dot mt-[6px] h-2 w-2 bg-lime" />
          Рекламний бюджет ви оплачуєте напряму Google або Meta. Ми не беремо відсоток від бюджету — тільки фіксовану оплату за роботу.
        </p>
        {FLAGS.niches && (
          <div className="mt-10 rounded-[20px] border border-dashed border-graphite-3 p-5">
            <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-gray">З якими нішами працюємо</p>
            <ul className="mt-3 flex flex-wrap gap-2 text-[14px] font-semibold">
              {['Послуги', 'Клініки', 'Авто', 'Меблі', 'E-commerce', 'B2B'].map(n => <li key={n} className="rounded-full bg-graphite-2 px-4 py-2">{n}</li>)}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
