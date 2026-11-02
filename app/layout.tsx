import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import Script from 'next/script';
import { Tracking } from '@/components/Tracking';
import { CONTACTS, SEO, SITE_URL } from '@/lib/site';
import './globals.css';

const nunito = Nunito({ subsets: ['cyrillic', 'latin'], weight: ['400', '600', '700', '800', '900'], display: 'swap', variable: '--font-nunito' });
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO.title,
  description: SEO.description,
  applicationName: 'Vismo Agency',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    siteName: 'Vismo Agency',
    url: '/',
    title: SEO.title,
    description: SEO.description,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Vismo Agency — заявки для вашого бізнесу з Google та Instagram' }],
  },
  twitter: { card: 'summary_large_image', title: SEO.title, description: SEO.description, images: ['/og-image.png'] },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '48x48' }, { url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.png',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: '#1E1F22', colorScheme: 'dark' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: 'Vismo Agency',
      alternateName: 'Vismo',
      legalName: 'ФОП Федченко Роман Євгенович',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo-512.png`,
      image: `${SITE_URL}/og-image.png`,
      description: SEO.description,
      email: CONTACTS.email,
      telephone: CONTACTS.phone,
      areaServed: 'UA',
      knowsAbout: ['Google Ads', 'Таргетована реклама в Instagram і Facebook', 'Google Analytics 4', 'Google Tag Manager', 'Google Business Profile', 'Розробка лендингів'],
      makesOffer: ['Налаштування Google Ads', 'Таргетована реклама в Instagram і Facebook', 'Налаштування аналітики GA4 і Google Tag Manager', 'Профіль компанії в Google Картах', 'Розробка сайтів і лендингів'].map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, areaServed: 'UA' } })),
      sameAs: [CONTACTS.instagram, CONTACTS.facebook].filter(Boolean),
      contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: CONTACTS.phone, email: CONTACTS.email, availableLanguage: ['uk'], areaServed: 'UA' },
    },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Vismo Agency', inLanguage: 'uk', publisher: { '@id': `${SITE_URL}/#org` } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={nunito.variable} suppressHydrationWarning>
      <head>
        {/* до першого кадру: ховаємо hero, який потім проявить Motion (без «блимання») */}
        <script dangerouslySetInnerHTML={{ __html: "if(!new URLSearchParams(location.search).has('static')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('anim')" }} />
      </head>
      <body className="font-sans">
        {GTM_ID && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {/* GTM і піксель важкі для мобільного LCP: стартують після першої дії або через 4 с після load. Події до старту чекають у dataLayer */}
              {`(function(w,d,i){var E=['pointerdown','keydown','touchstart','scroll'],t,on;function go(){if(on)return;on=1;clearTimeout(t);E.forEach(function(e){w.removeEventListener(e,go)});w.dataLayer=w.dataLayer||[];w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var j=d.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;d.head.appendChild(j)}E.forEach(function(e){w.addEventListener(e,go,{passive:true})});function arm(){t=setTimeout(go,4000)}d.readyState==='complete'?arm():w.addEventListener('load',arm)})(window,document,'${GTM_ID}');`}
            </Script>
            <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} /></noscript>
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Tracking />
        {children}
      </body>
    </html>
  );
}
