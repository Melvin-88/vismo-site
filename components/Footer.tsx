/* eslint-disable @next/next/no-img-element */
import { CONTACTS } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-graphite-3">
      <div className="container-x flex flex-col gap-8 py-12 pb-28 lg:flex-row lg:items-end lg:justify-between lg:py-16">
        <div>
          <img src="/vismo-logo-white.svg" alt="Vismo Agency" width={101} height={48} loading="lazy" className="h-12 w-auto" />
          <p className="mt-4 text-[14px] text-gray">Vismo Agency · маркетингова агенція · Україна</p>
        </div>
        <div className="space-y-3 text-[15px] lg:text-right">
          <p className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
            <a href={`tel:${CONTACTS.phone}`} data-contact="phone" className="inline-flex min-h-[44px] items-center hover:text-lime">{CONTACTS.phoneLabel}</a>
            <a href={`mailto:${CONTACTS.email}`} data-contact="email" className="inline-flex min-h-[44px] items-center hover:text-lime">{CONTACTS.email}</a>
            <a href={CONTACTS.instagram} target="_blank" rel="noopener noreferrer" data-contact="instagram" className="inline-flex min-h-[44px] items-center hover:text-lime">Instagram {CONTACTS.instagramHandle}</a>
            {CONTACTS.facebook && <a href={CONTACTS.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center hover:text-lime">Facebook</a>}
          </p>
          <p className="text-[14px] text-gray">
            <a href="/privacy" className="underline underline-offset-2 hover:text-white">Політика конфіденційності</a> · © 2026
          </p>
          <a href="/#form" data-cta="footer" className="btn btn-primary !min-h-[44px] !text-[15px]">Отримати безкоштовний розбір</a>
        </div>
      </div>
    </footer>
  );
}
