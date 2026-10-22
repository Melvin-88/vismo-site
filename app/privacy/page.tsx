import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { CONTACTS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Політика конфіденційності — Vismo',
  description: 'Як Vismo Agency збирає, використовує й захищає дані, які ви залишаєте у формі заявки на сайті vismo.com.ua.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', locale: 'uk_UA', siteName: 'Vismo Agency', url: '/privacy', title: 'Політика конфіденційності — Vismo', images: ['/og-image.png'] },
};

// TODO(Роман, задача №15.6): замінити текст на docs/privacy.md і заповнити поля в [дужках] ДО публікації
export default function Privacy() {
  return (
    <>
      <Header />
      <main className="container-x section-y">
        <article className="max-w-prose text-[16px] leading-[1.65] text-gray [&_a]:text-white [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:text-white [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <h1 className="text-[32px] font-extrabold leading-[1.2] text-white lg:text-[44px]">Політика конфіденційності</h1>
          <p>Редакція від [дата]. Власник сайту vismo.com.ua — [ПІБ / ФОП] (далі — «Vismo Agency», «ми»).</p>

          <h2>1. Які дані ми збираємо</h2>
          <ul>
            <li>дані, які ви вводите у форму заявки: імʼя, телефон або Telegram, email, посилання на ваш бізнес, коментар, цифри з калькулятора;</li>
            <li>джерело переходу на сайт: UTM-мітки, gclid / fbclid, сторінка входу, referrer, дата першого візиту;</li>
            <li>технічні дані, які автоматично збирають сервіси аналітики та захисту від спаму (IP-адреса, тип пристрою й браузера, cookies).</li>
          </ul>

          <h2>2. Навіщо</h2>
          <p>Щоб звʼязатися з вами щодо заявки, провести безкоштовний розбір, зрозуміти, яка реклама приводить клієнтів, і захистити форму від спаму.</p>

          <h2>3. Кому передаються дані</h2>
          <ul>
            <li>Telegram — заявка надходить у робочий чат менеджера;</li>
            <li>Cloudflare — хостинг сайту, обробка форми й Cloudflare Turnstile (захист від ботів);</li>
            <li>Google Tag Manager і Google Analytics 4 — знеособлена статистика відвідувань;</li>
            <li>Meta Pixel — вимірювання ефективності реклами в Instagram і Facebook (якщо підключено).</li>
          </ul>
          <p>Ми не продаємо й не передаємо ваші дані третім особам для їхнього маркетингу.</p>

          <h2>4. Зберігання</h2>
          <p>Заявки не зберігаються в базі даних сайту — лише в чаті Telegram. Ми зберігаємо їх [строк зберігання] і видаляємо на ваш запит. Джерело переходу зберігається у вашому браузері (localStorage) і не передається нікуди, крім разом із заявкою.</p>

          <h2>5. Cookies</h2>
          <p>Сервіси аналітики використовують cookies. Ви можете вимкнути або видалити їх у налаштуваннях браузера — сайт працюватиме й без них.</p>

          <h2>6. Ваші права</h2>
          <p>Відповідно до Закону України «Про захист персональних даних» ви можете дізнатися, які дані про вас ми маємо, виправити їх, відкликати згоду або попросити видалити. Напишіть на <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a> або зателефонуйте <a href={`tel:${CONTACTS.phone}`}>{CONTACTS.phoneLabel}</a>.</p>

          <h2>7. Зміни</h2>
          <p>Ми можемо оновлювати цю політику. Актуальна версія завжди на цій сторінці.</p>

          <p className="mt-10"><a href="/">← На головну</a></p>
        </article>
      </main>
      <Footer />
    </>
  );
}
