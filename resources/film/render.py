"""Рендер hero-циклу: python render.py sheet  → film/sheet.png (кадр на кожен біт)
                     python render.py full   → film/hero-loop.mp4 + .webm + poster.jpg"""
import subprocess, sys, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

here = Path(__file__).resolve().parent
LOOP, FPS, SUB = 8.0, 30, 2
W, H = 1120, 700

def open_page(p):
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": W, "height": H})
    pg.goto((here / "film.html").as_uri(), wait_until="networkidle")
    pg.wait_for_function("window.ready === true")
    return b, pg

def shot(pg, t, path):
    pg.evaluate(f"seek({t})")
    pg.evaluate("new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))")
    pg.locator("#stage").screenshot(path=str(path))

mode = sys.argv[1] if len(sys.argv) > 1 else "sheet"
with sync_playwright() as p:
    b, pg = open_page(p)
    if mode == "sheet":
        ts = [k * 0.5 + 0.12 for k in range(16)] + [float(a) for a in sys.argv[2:]]
        tmp = here / "_sheet"; tmp.mkdir(exist_ok=True)
        ims = []
        for i, t in enumerate(ts):
            shot(pg, t, tmp / f"{i:02d}.png"); ims.append(Image.open(tmp / f"{i:02d}.png").resize((W // 3, H // 3)))
        cols = 4; rows = (len(ims) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * W // 3, rows * H // 3))
        for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * W // 3, (i // cols) * H // 3))
        sheet.save(here / "sheet.png"); shutil.rmtree(tmp); print("sheet", ts)
    else:
        frames = here / "_frames"; frames.mkdir(exist_ok=True)
        n = int(LOOP * FPS) * SUB
        for i in range(n):  # subframes centred on each frame time, blended by tmix
            t = (i // SUB) / FPS + ((i % SUB) - (SUB - 1) / 2) / (FPS * SUB)
            shot(pg, t, frames / f"s{i:05d}.png")
        b.close()
        vf = f"tmix=frames={SUB},select='eq(mod(n\\,{SUB})\\,{SUB-1})',setpts=N/({FPS}*TB),format=yuv420p"
        src = ["-framerate", str(FPS * SUB), "-i", str(frames / "s%05d.png")]
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *src, "-vf", vf, "-r", str(FPS), "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-movflags", "+faststart", "-an", str(here / "hero-loop.mp4")], check=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *src, "-vf", vf, "-r", str(FPS), "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-an", str(here / "hero-loop.webm")], check=True)
        shutil.copy(frames / "s00000.png", here / "poster.png")
        Image.open(here / "poster.png").convert("RGB").save(here / "poster.jpg", quality=82)
        (here / "poster.png").unlink(); shutil.rmtree(frames)
        for f in ("hero-loop.mp4", "hero-loop.webm", "poster.jpg"): print(f, (here / f).stat().st_size // 1024, "KB")
