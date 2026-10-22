import { FAQ } from '@/lib/site';
import { Icon } from './ui/Icon';

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y !pt-0">
      <div className="container-x lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 id="faq-title" className="text-[27px] font-extrabold leading-[1.2] lg:text-[42px]">Питання</h2>
        <div className="mt-7 divide-y divide-graphite-3 border-y border-graphite-3 lg:mt-0">
          {FAQ.map(([q, a], i) => (
            <details key={q} open={i === 0} className="group py-1">
              <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-4 py-3 text-[17px] font-bold lg:text-[20px]">
                <h3>{q}</h3>
                <span className="faq-plus grid h-9 w-9 flex-none place-items-center rounded-full bg-graphite-3"><Icon name="plus" className="!h-5 !w-5" /></span>
              </summary>
              <p className="max-w-prose pb-5 pr-12 text-[16px] leading-[1.55] text-gray lg:text-[17px]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
