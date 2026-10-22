/* eslint-disable @next/next/no-img-element */
import { Icon } from './ui/Icon';

const PAINS = [
  'Реклама є, а заявок мало — і незрозуміло чому.',
  'Гроші на рекламу йдуть, але не видно, яка саме приносить клієнтів.',
  'Клієнти шукають у Google Картах, а знаходять конкурентів.',
];

export function Problems() {
  return (
    <section aria-labelledby="pains-title" className="section-y !pt-8 lg:!pt-12">
      <div className="container-x">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 id="pains-title" className="text-[27px] font-extrabold leading-[1.2] lg:text-[42px]">Знайомо?</h2>
            <ul className="mt-7 grid gap-3 lg:mt-10">
              {PAINS.map(p => (
                <li key={p} className="flex gap-4 rounded-[20px] bg-graphite-2 p-5 lg:p-6">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-graphite-3 text-gray"><Icon name="x" className="!h-[18px] !w-[18px]" /></span>
                  <p className="text-[16px] leading-[1.5] lg:text-[17px]">{p}</p>
                </li>
              ))}
            </ul>
          </div>
          <img src="/illustrations/ill-pains.webp" width={1200} height={900} loading="lazy" decoding="async"
            alt="Власник бізнесу сумно дивиться на графік заявок, що падає" className="order-first h-auto w-full rounded-card lg:order-none" />
        </div>
      </div>
    </section>
  );
}
