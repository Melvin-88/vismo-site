"""Запис превʼю анімацій: python record.py [desktop|mobile] → shots/motion-<mode>.mp4"""
import shutil, subprocess, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

here = Path(__file__).resolve().parent
mode = sys.argv[1] if len(sys.argv) > 1 else "desktop"
size = {"desktop": (1440, 900), "mobile": (390, 844)}[mode]
tmp = here / "_rec"; shutil.rmtree(tmp, ignore_errors=True)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": size[0], "height": size[1]}, record_video_dir=str(tmp),
                        record_video_size={"width": size[0], "height": size[1]}, is_mobile=mode == "mobile")
    pg = ctx.new_page()
    pg.goto((here / "index.html").as_uri(), wait_until="networkidle")
    pg.wait_for_timeout(3800)                      # інтро першого екрана
    pg.hover("#c-cpl"); pg.mouse.down(); pg.mouse.move(pg.locator("#c-cpl").bounding_box()["x"] + 160, pg.locator("#c-cpl").bounding_box()["y"] + 14, steps=12); pg.mouse.up()
    pg.wait_for_timeout(600)
    pg.click('#calc [data-go="form"]'); pg.wait_for_timeout(1400)
    pg.click('#calc [data-go="calc"]'); pg.wait_for_timeout(800)
    total = pg.evaluate("document.documentElement.scrollHeight")
    y = 0
    while y < total:                               # плавна прокрутка зі зупинками на секціях
        y += 90; pg.mouse.wheel(0, 90); pg.wait_for_timeout(60)
        if y % 900 < 90: pg.wait_for_timeout(1600)
    pg.wait_for_timeout(1500)
    video = pg.video.path(); ctx.close(); b.close()

out = here / "shots" / f"motion-{mode}.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-c:v", "libx264", "-crf", "26", "-preset", "veryfast",
                "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)], check=True)
shutil.rmtree(tmp, ignore_errors=True)
print(out, out.stat().st_size // 1024, "KB")
