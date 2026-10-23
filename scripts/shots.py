"""Capturas con Playwright. Requiere el dist/ servido en http://localhost:4321/web-salvaje-beach/ (npm run preview)."""
import sys
from playwright.sync_api import sync_playwright
URL = 'http://localhost:4321/web-salvaje-beach/'
OUT = '/workspace/webs/salvaje-beach/'
def settle(pg):
    h = pg.evaluate('document.body.scrollHeight'); y = 0
    while y < h:
        pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(150); y += 500
        h = pg.evaluate('document.body.scrollHeight')
    pg.evaluate('document.querySelectorAll(".reveal").forEach(e=>e.classList.add("is-visible"))')
    pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(1500)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=no-user-gesture-required'])
    errs = []
    pg = b.new_page(viewport={'width': 1440, 'height': 900})
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('response', lambda r: errs.append(f'{r.status} {r.url}') if r.status >= 400 else None)
    pg.goto(URL, wait_until='networkidle'); pg.wait_for_timeout(2500)
    # Fotograma fijo y representativo del hero (vino servido en la playa) para que la captura sea estable
    pg.evaluate('(()=>{const v=document.querySelector("[data-hero-video]");v.pause();v.currentTime=4.2})()'); pg.wait_for_timeout(900)
    pg.screenshot(path=OUT + 'preview-hero.png')
    pg.evaluate('document.querySelector("[data-hero-video]").play()')
    settle(pg); pg.screenshot(path=OUT + 'preview-desktop.png', full_page=True)
    pg.evaluate('document.getElementById("beach-club").scrollIntoView()'); pg.wait_for_timeout(3500)
    pg.locator('#beach-club').screenshot(path=OUT + 'preview-beachclub.png')
    pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(500)
    m = b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    m.goto(URL, wait_until='networkidle'); m.wait_for_timeout(3000)
    m.screenshot(path='/tmp/s/mobile-hero.png')
    settle(m); m.screenshot(path=OUT + 'preview-mobile.png', full_page=True)
    print('\n'.join(errs) or 'no errors')
    b.close()
