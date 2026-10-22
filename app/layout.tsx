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
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/icon-512.png`,
      image: `${SITE_URL}/og-image.png`,
      description: SEO.description,
      email: CONTACTS.email,
      telephone: CONTACTS.phone,
      areaServed: 'UA',
      knowsAbout: ['Google Ads', 'Таргетована реклама в Instagram і Facebook', 'Google Analytics 4', 'Google Tag Manager', 'Google Business Profile', 'Розробка лендингів'],
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
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
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
