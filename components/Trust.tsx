/* eslint-disable @next/next/no-img-element */
import { Icon } from './ui/Icon';

const ITEMS = [
  { icon: 'key', title: 'Акаунти — ваші.', text: 'Рекламні кабінети й аналітика оформлені на вас, ми працюємо через доступ, який ви можете забрати будь-коли.' },
  { icon: 'trend', title: 'Цифри з першого дня.', text: 'Не «охоплення», а заявки і їхня ціна.' },
  { icon: 'wallet', title: 'Фіксована оплата.', text: 'Без відсотка від рекламного бюджету.' },
  { icon: 'globe', title: 'Працюємо онлайн по всій Україні.', text: 'Звʼязок у месенджері, дзвінки й відеозустрічі.' },
] as const;

export function Trust() {
  return (
    <section aria-labelledby="trust-title" className="section-y !pt-0">
      <div className="container-x">
        <h2 id="trust-title" className="text-[27px] font-extrabold leading-[1.2] lg:text-[42px]">Чому з нами спокійно</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-5">
          <img src="/illustrations/ill-mechanic.webp" width={900} height={1200} loading="lazy" decoding="async"
            alt="Майстер СТО спокійно отримує нову заявку на телефон" className="h-full w-full rounded-card object-cover sm:col-span-2 lg:col-span-1 lg:row-span-2" />
          {ITEMS.map(it => (
            <div key={it.title} className="rounded-card bg-graphite-2 p-6 lg:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-graphite-3 text-lime"><Icon name={it.icon} /></span>
              <h3 className="mt-5 text-[20px] font-bold lg:text-[23px]">{it.title}</h3>
              <p className="mt-2 text-[16px] leading-[1.55] text-gray">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
