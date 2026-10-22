/* eslint-disable @next/next/no-img-element */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-graphite-3 bg-[rgba(30,31,34,.82)] backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between lg:h-[76px]">
        <a href="/" aria-label="Vismo Agency — на головну">
          <picture>
            <source media="(min-width: 1024px)" srcSet="/vismo-logo-white.svg" width={92} height={44} />
            <img src="/vismo-wordmark-white.svg" alt="Vismo Agency" width={86} height={32} className="h-8 w-auto lg:h-11" />
          </picture>
        </a>
        <nav className="hidden items-center gap-9 text-[16px] font-semibold text-gray lg:flex" aria-label="Розділи">
          <a href="/#services" className="hover:text-white">Послуги</a>
          <a href="/#process" className="hover:text-white">Як працюємо</a>
          <a href="/#faq" className="hover:text-white">Питання</a>
        </nav>
        <a href="/#form" data-cta="header" className="btn btn-primary !min-h-[44px] !px-5 !text-[16px] lg:hidden">Розбір</a>
        <a href="/#form" data-cta="header" className="btn btn-primary !min-h-[48px] hidden lg:inline-flex">Отримати безкоштовний розбір</a>
      </div>
    </header>
  );
}
