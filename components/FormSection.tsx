/* eslint-disable @next/next/no-img-element */
import { CONTACTS } from '@/lib/site';
import { LeadForm } from './LeadForm';
import { Icon } from './ui/Icon';

const LINKS = [
  { href: CONTACTS.instagram, icon: 'instagram', label: CONTACTS.instagramHandle, short: 'Instagram', type: 'instagram', ext: true },
  { href: `tel:${CONTACTS.phone}`, icon: 'phone', label: CONTACTS.phoneLabel, short: 'Зателефонувати', type: 'phone' },
  { href: `mailto:${CONTACTS.email}`, icon: 'mail', label: CONTACTS.email, short: 'Email', type: 'email' },
] as const;
const ext = (on?: boolean) => (on ? { target: '_blank', rel: 'noopener noreferrer' } : {});

export function FormSection() {
  return (
    <section id="form" aria-labelledby="form-title" className="section-y !pt-0">
      <div className="container-x">
        <div className="grid gap-8 rounded-[28px] bg-off-white p-5 text-graphite sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:p-14">
          <div>
            <div className="flex items-center gap-[6px]" aria-hidden="true"><span className="dot h-[14px] w-[14px] bg-lime-on-light" /><span className="dot h-[9px] w-[9px] bg-lime-on-light" /><span className="dot h-[6px] w-[6px] bg-lime-on-light" /></div>
            <h2 id="form-title" className="mt-5 text-[27px] font-extrabold leading-[1.2] lg:text-[42px] lg:leading-[1.15]">Безкоштовний розбір вашої реклами</h2>
            <p className="mt-4 text-[16px] leading-[1.55] text-gray-on-light lg:text-[18px]">Залиште контакти — подивимось ваш профіль і рекламу та підкажемо, що покращити. Ні до чого не зобовʼязує.</p>
            <img src="/illustrations/ill-clinic.webp" width={1200} height={900} loading="lazy" decoding="async"
              alt="Адміністраторка клініки приймає дзвінки й записи від клієнтів з реклами" className="mt-6 h-auto w-full rounded-card lg:mt-8" />
            <ul className="mt-8 hidden space-y-3 text-[16px] font-semibold lg:block">
              {LINKS.map(l => (
                <li key={l.type}>
                  <a href={l.href} data-contact={l.type} {...ext('ext' in l && l.ext)} className="inline-flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-[var(--shadow-light)]"><Icon name={l.icon} className="!h-5 !w-5" /></span>{l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <LeadForm />
          {/* mobile: альтернативні контакти під формою */}
          <ul className="flex flex-wrap gap-2 text-[15px] font-semibold lg:hidden">
            {LINKS.map(l => (
              <li key={l.type}>
                <a href={l.href} data-contact={l.type} {...ext('ext' in l && l.ext)} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4">
                  <Icon name={l.icon} className="!h-[18px] !w-[18px]" />{l.short}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
