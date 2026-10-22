# vismo-landing

Лендинг vismo.com.ua: Next.js (static export) + Tailwind → Cloudflare Pages, форма → Pages Function → Telegram.

```bash
npm run dev     # локально, http://localhost:3000
npm test        # валідація + Pages Function (node --test)
npm run build   # статичний сайт у out/
```

## Cloudflare Pages
- Build command `npm run build`, output `out`, Node 22.
- Build env: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (див. `.env.example`).
- Functions secrets: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TURNSTILE_SECRET_KEY`. Без них `/api/lead` відповідає помилкою.
- `www` → без `www` (301): Cloudflare Redirect Rule (Pages `_redirects` не вміє редіректи за доменом). «Always Use HTTPS» — увімкнути.

## Що налаштовується в коді
- `lib/site.ts` — контакти (Facebook порожній → не показується), SEO title/description, FAQ, прапорці опційних блоків.
- `app/privacy/page.tsx` — чернетка політики; заповнити `[ПІБ / ФОП]`, `[дата]`, `[строк зберігання]` до публікації.
- `public/_headers` — безпекові заголовки, CSP поки в Report-Only.
