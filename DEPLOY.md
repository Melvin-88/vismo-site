# Деплой vismo.com.ua на Cloudflare Pages

Репозиторій: https://github.com/Melvin-88/vismo-site (гілка `main`).
Сайт — статичний Next.js (`output: 'export'` → папка `out/`) + одна Pages Function `functions/api/lead.ts` (форма → Telegram).
Локальна перевірка: `npm ci && npm test && npm run build` — має пройти без помилок.

## 1. Що потрібно від власника (Роман) до деплою
- **Telegram-бот:** токен від @BotFather; бот доданий у чат для заявок; `chat_id` цього чату.
- **Cloudflare Turnstile:** віджет для `vismo.com.ua` і `*.pages.dev` → Site Key + Secret Key.
- **Політика:** заповнити `[ПІБ / ФОП]`, `[дата]`, `[строк зберігання]` в `app/privacy/page.tsx`.
- **Facebook:** посилання в `lib/site.ts` → `CONTACTS.facebook` (порожнє — не показується).
- (пізніше) **GTM:** ID контейнера.

## 2. Створити проєкт Pages
Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → `Melvin-88/vismo-site`.

| Налаштування | Значення |
|---|---|
| Production branch | `main` |
| Framework preset | None (або Next.js (Static HTML Export)) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | `/` |
| Env `NODE_VERSION` | `22` |

Папку `functions/` Pages підхоплює автоматично → `POST /api/lead`.

## 3. Змінні оточення (Settings → Variables and Secrets, Production + Preview)
Build (звичайні змінні — потрапляють у клієнтський код):
- `NEXT_PUBLIC_SITE_URL` = `https://vismo.com.ua`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = Site Key Turnstile
- `NEXT_PUBLIC_GTM_ID` = ID GTM (можна порожнім — тоді GTM не підключається)

Secrets (тип **Secret**, тільки для Function):
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TURNSTILE_SECRET_KEY`

Після зміни змінних — **Retry deployment** (NEXT_PUBLIC_* вшиваються під час збірки).

## 4. Перевірка на `*.pages.dev`
- Відкрити `https://<project>.pages.dev/?utm_source=test&utm_campaign=check`, надіслати форму → заявка в Telegram з «Джерело: test / check».
- Те саме через калькулятор (кнопка «Розрахувати») → у Telegram позначка «(калькулятор)» і розрахунок.
- Невалідний телефон блокується; без проходження Turnstile — помилка з посиланнями на Instagram/телефон.
- `/privacy`, `/404` (будь-яка неіснуюча адреса), `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` відкриваються.
- Заголовки з `public/_headers` віддаються (DevTools → Network → документ).
- Важливо: Turnstile перевіряє, що токен виданий на тому ж домені, куди йде запит (`functions/api/lead.ts`), тому домен `*.pages.dev` має бути доданий у віджет Turnstile.

## 5. Домен
- Pages → Custom domains → `vismo.com.ua` (зона вже в Cloudflare) і `www.vismo.com.ua`.
- SSL/TLS → Edge Certificates → **Always Use HTTPS** = On.
- Rules → Redirect Rules: `www.vismo.com.ua/*` → `https://vismo.com.ua/${1}`, 301, зберігати query string.
  (Pages `_redirects` не вміє редірект за доменом.)
- HSTS — увімкнути пізніше, після стабільної роботи по HTTPS.

## 6. Після запуску
- Google Search Console: підтвердження через DNS TXT у Cloudflare, подати `https://vismo.com.ua/sitemap.xml`.
- Перевірити OG-прев'ю (Facebook Sharing Debugger, Telegram), JSON-LD (validator.schema.org), Lighthouse mobile (очікувано ≥ 95 / 100 / 100 / 100).
- CSP зараз у режимі `Report-Only` (`public/_headers`); жорсткий режим — після налаштування GTM.
- При зміні тексту сторінок оновлювати дати в `app/sitemap.ts`.

## Нюанси
- Не запускати `npm run build`, поки працює `npm run dev` в тій самій папці — обидва пишуть у `.next/` і dev-сервер ламається (лікується `rm -rf .next`).
- Анімації (GSAP) — `components/Motion.tsx`; `?static` в URL їх вимикає. Опційні блоки — прапорці `FLAGS` у `lib/site.ts`.
- Тести: `npm test` (валідація + Function з підміненим fetch).
