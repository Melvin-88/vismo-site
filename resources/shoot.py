"""Знімає макети: python shoot.py  →  shots/*.png"""
from pathlib import Path
from playwright.sync_api import sync_playwright

here = Path(__file__).resolve().parent
url = (here / "index.html").as_uri() + "?static"  # макети без анімацій
out = here / "shots"
out.mkdir(exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, w, h, full in [
        ("mobile-375-full", 375, 812, True),
        ("mobile-375-first-screen", 375, 812, False),
        ("desktop-1440-full", 1440, 900, True),
        ("desktop-1440-first-screen", 1440, 900, False),
    ]:
        page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
        page.goto(url, wait_until="networkidle")
        # lazy-картинки нижче першого екрана інакше не потрапляють у full-page скрін
        page.evaluate("Promise.all([...document.images].map(i => (i.loading = 'eager', i.decode().catch(() => {}))))")
        page.evaluate("document.fonts.ready")
        assert page.evaluate("document.fonts.check('800 20px Nunito')"), "Nunito не завантажився"
        page.screenshot(path=str(out / f"{name}.png"), full_page=full)
        if not full:  # другий стан калькулятора: форма «Отримати прорахунок»
            page.click('#calc [data-go="form"]')
            page.add_style_tag(content="header{position:static!important}")
            page.locator('#calc').screenshot(path=str(out / f"{name.split('-first')[0]}-calc-form.png"))
            page.fill('#q-name', 'Тест'); page.fill('#q-phone', '+380000000000')
            page.check('#calc [data-step="form"] input[type=checkbox]')
            page.click('#calc [data-step="form"] button.btn-primary')
            page.locator('#calc').screenshot(path=str(out / f"{name.split('-first')[0]}-calc-done.png"))
        page.close()
        print("saved", name)
    browser.close()
