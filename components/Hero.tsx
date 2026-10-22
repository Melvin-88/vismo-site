import { preload } from 'react-dom';
import { CONTACTS } from '@/lib/site';
import { Calculator } from './Calculator';
import { Icon } from './ui/Icon';

export function Hero() {
  preload('/film/poster.webp', { as: 'image', fetchPriority: 'high' }); // постер відео — LCP-елемент
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-x grid items-start gap-12 pb-16 pt-9 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28 lg:pt-20">
        <div className="lg:pt-10">
          <div className="mb-6 flex items-center gap-[6px]" aria-hidden="true">
            <span className="dot h-[14px] w-[14px] bg-lime" /><span className="dot h-[9px] w-[9px] bg-lime" /><span className="dot h-[6px] w-[6px] bg-lime" />
          </div>
          <h1 id="hero-title" className="text-[35px] font-extrabold leading-[1.15] tracking-[-0.01em] lg:text-[58px] lg:leading-[1.08]">
            Заявки для вашого бізнесу з&nbsp;<span className="text-lime">Google</span> та&nbsp;<span className="text-lime">Instagram</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-[16px] leading-[1.55] text-gray lg:mt-7 lg:text-[19px] lg:leading-[1.6]">
            Налаштуємо рекламу, аналітику й Google Карти так, щоб ви бачили, звідки приходить кожен клієнт і скільки він коштує.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-10">
            <a href="#form" data-cta="hero" className="btn btn-primary w-full sm:w-auto">Отримати безкоштовний розбір</a>
            <a href={CONTACTS.instagram} target="_blank" rel="noopener noreferrer" data-contact="instagram" className="btn btn-secondary w-full sm:w-auto">
              <Icon name="instagram" className="!h-5 !w-5" />Написати в Instagram
            </a>
          </div>
          <p className="mt-4 text-[14px] text-gray">Відповідаємо протягом робочого дня.</p>
          <div className="mt-8 overflow-hidden rounded-card border border-graphite-3 lg:mt-12">
            {/* Hero-цикл 8 с: реклама → повідомлення → заявка → лічильник */}
            <video className="hero-loop block aspect-[8/5] w-full" width={1120} height={700} autoPlay muted loop playsInline preload="metadata" poster="/film/poster.webp"
              aria-label="Як реклама перетворюється на заявку: пост, повідомлення, нова заявка">
              <source src="/film/hero-loop.webm" type="video/webm" />
              <source src="/film/hero-loop.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <Calculator />
      </div>
    </section>
  );
}
