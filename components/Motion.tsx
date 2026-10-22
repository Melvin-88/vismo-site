'use client';
import { useEffect } from 'react';

// Порт resources/motion.js: GSAP 3 + ScrollTrigger, лише transform/opacity/filter.
// Усе всередині matchMedia: при prefers-reduced-motion анімацій немає. ?static вимикає анімації.
// GSAP вантажиться динамічним import, щоб не блокувати перший рендер.
type El = HTMLElement;
const $ = (s: string, r: ParentNode = document) => r.querySelector<El>(s);
const $$ = (s: string, r: ParentNode = document) => [...r.querySelectorAll<El>(s)];
const SPRING = 'back.out(1.4)'; // ледь помітний overshoot, без «пружинок»

export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    if (new URLSearchParams(location.search).has('static')) return root.classList.remove('anim');
    let revert = () => {};
    let cancelled = false;

    // старт у вільний момент браузера: ініціалізація GSAP не конкурує з першим рендером (LCP)
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    new Promise<void>(r => idle(() => r(), { timeout: 1200 }))
      .then(() => Promise.all([import('gsap'), import('gsap/ScrollTrigger')]))
      .then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      // CSS-запобіжник (globals.css) показує hero через 2,5 с; якщо GSAP запізнився — інтро пропускаємо
      const intro = root.classList.contains('anim') && performance.now() < 2300;
      gsap.registerPlugin(ScrollTrigger);
      gsap.defaults({ ease: 'power3.out', duration: 0.7 });

      // Заголовок: кожне слово в маску, кольорові span-и цілком
      function splitWords(el: El) {
        const out: El[] = [];
        const wrap = (inner: Node) => {
          const m = document.createElement('span'); m.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.08em;margin-bottom:-.08em';
          const w = document.createElement('span'); w.style.display = 'inline-block'; w.append(inner); m.append(w); out.push(w); return m;
        };
        [...el.childNodes].forEach(node => {
          if (node.nodeType === 3) {
            const frag = document.createDocumentFragment();
            // ділимо лише за звичайними пробілами: &nbsp; лишається в слові
            (node.textContent || '').split(/([ \n\t]+)/).forEach(part => {
              if (!part) return;
              frag.append(/^[ \n\t]+$/.test(part) ? document.createTextNode(part) : wrap(document.createTextNode(part)));
            });
            node.replaceWith(frag);
          } else node.replaceWith(wrap(node.cloneNode(true)));
        });
        return out;
      }

      // Лічильник: «9 600 ₴» → рахує від 0 до числа зі збереженням формату
      function countUp(el: El, opts = {}) {
        const m = (el.textContent || '').match(/^([^\d]*)([\d\s ]+)(.*)$/); if (!m) return null;
        const target = +m[2].replace(/\s| /g, ''), o = { v: 0 };
        return gsap.to(o, { v: target, duration: 1.2, ease: 'power2.out', ...opts,
          onUpdate: () => { el.textContent = m[1] + Math.round(o.v).toLocaleString('uk-UA') + m[3]; } });
      }

      // React-контрольований range: значення ставимо нативним сетером, щоб onChange спрацював
      const setRange = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      const setValue = (r: HTMLInputElement, v: number) => { setRange.call(r, String(v)); r.dispatchEvent(new Event('input', { bubbles: true })); };

      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // ---------- 1. Перший екран ----------
        const hero = $('#hero')!, [left, calc] = $$('#hero > div > *');
        const card = calc.children[1] as El;
        if (intro) {
        gsap.set([...left.children, calc], { visibility: 'visible' });
        const h1 = $('h1', hero)!;
        const words = h1.dataset.split ? $$('span > span', h1) : splitWords(h1);
        h1.dataset.split = '1';
        const tl = gsap.timeline({ delay: 0.1 });
        tl.from($$('.dot', left.firstElementChild!), { scale: 0, duration: 0.5, ease: SPRING, stagger: 0.08 })
          .from(words, { yPercent: 110, rotation: 4, duration: 0.8, stagger: 0.06 }, '-=0.25')
          .from([...left.children].slice(2, -1), { autoAlpha: 0, y: 24, stagger: 0.09 }, '-=0.5')
          .from(calc.firstElementChild!.children, { scale: 0, ease: SPRING, stagger: 0.07, duration: 0.5 }, 0.35)
          .from(card, { autoAlpha: 0, x: 40, filter: 'blur(8px)', duration: 0.9 }, 0.45);

        // повзунки «доїжджають» до своїх значень, цифри відлічуються
        $$('.range', calc).forEach((el, i) => {
          const r = el as HTMLInputElement, end = +r.value, o = { v: +r.min };
          tl.to(o, { v: end, duration: 1, ease: 'power2.inOut', onUpdate: () => setValue(r, Math.round(o.v)), onComplete: () => setValue(r, end) }, 0.8 + i * 0.1);
        });
        }

        // ---------- 2. Калькулятор: мікрорухи ----------
        // значення злегка «пружинить» під пальцем (тільки від людини, не від інтро)
        const onInput = (e: Event) => {
          const k = (e.target as El).dataset.k;
          if (!e.isTrusted || !k) return;
          gsap.fromTo($(`[data-out="${k}"]`, calc), { scale: 1.12 }, { scale: 1, duration: 0.35, ease: 'power2.out', overwrite: true, transformOrigin: 'right center' });
        };
        calc.addEventListener('input', onInput);
        // закритий результат «рахується»: розмиті смуги дихають
        const breathe = () => {
          const res = $('[data-result]', calc); if (!res) return;
          gsap.to($$('[class*="blur-"]', res), { opacity: 0.35, duration: 0.9, ease: 'sine.inOut', stagger: { each: 0.15, repeat: -1, yoyo: true } });
          gsap.to($('[data-i="lock"]', res)!.parentElement, { scale: 1.12, duration: 0.6, ease: 'sine.inOut', repeat: -1, yoyo: true, repeatDelay: 1.2 });
        };
        breathe();
        // перемикання калькулятор → форма → «дякуємо» (React підміняє вміст картки)
        const mo = new MutationObserver(recs => recs.forEach(r => r.addedNodes.forEach(n => {
          if (!(n instanceof HTMLElement)) return;
          gsap.fromTo(n, { autoAlpha: 0, y: 18, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, clearProps: 'filter' });
          if (n.getAttribute('role') === 'status') gsap.from($$('.dot', n), { scale: 0, ease: SPRING, stagger: 0.1, delay: 0.15 });
          if ($('[data-result]', n)) breathe();
        })));
        mo.observe(card, { childList: true });

        // ---------- 3. Поява секцій ----------
        $$('main section:not(#hero) h2').forEach(h => gsap.from(h, { autoAlpha: 0, y: 30, scrollTrigger: { trigger: h, start: 'top 88%' } }));
        const cards = $$('main section:not(#hero) li, #services article, #services > div > p, #services .border-dashed, main section .rounded-card:not(img), #faq details, #form .container-x > div > *');
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(cards, { start: 'top 90%', once: true,
          onEnter: b => { gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.08, overwrite: true }); } });
        // ілюстрації: поява + легкий паралакс
        $$('main img[src*="illustrations"]').forEach(img => {
          gsap.from(img, { autoAlpha: 0, scale: 0.94, duration: 1, scrollTrigger: { trigger: img, start: 'top 90%' } });
          gsap.fromTo(img, { yPercent: 4 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        });

        // ---------- 4. Живі сценки в картках послуг ----------
        const loop = (screen: El | undefined, build: (t: gsap.core.Timeline, kids: El[]) => void) => {
          if (!screen) return; // картку вимкнено прапорцем
          const t = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.6 });
          build(t, [...screen.children] as El[]);
          ScrollTrigger.create({ trigger: screen, start: 'top 85%', end: 'bottom 10%', onToggle: s => { if (s.isActive) t.play(); else t.pause(); } });
        };
        const [sGoogle, sInsta, sMaps, sAn, sSite, sContent] = $$('#services article > div[aria-hidden]');
        loop(sGoogle, (t, [bar, ad, cursor]) => {
          const [q, caret] = $$('span', bar), text = q.textContent || '', o = { n: 0 };
          t.set(q, { textContent: '' }).set([ad, cursor], { autoAlpha: 0 })
           .to(o, { n: text.length, duration: 1.1, ease: 'none', onUpdate: () => { q.textContent = text.slice(0, Math.round(o.n)); } })
           .fromTo(ad, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5 }, '+=0.15')
           .fromTo(cursor, { autoAlpha: 0, x: 40, y: 30 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.1')
           .to(cursor, { scale: 0.8, duration: 0.08, yoyo: true, repeat: 1 })
           .to(ad, { scale: 0.97, duration: 0.08, yoyo: true, repeat: 1 }, '<')
           .to({}, { duration: 1.2 });
          gsap.to(caret, { autoAlpha: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'steps(1)' });
        });
        loop(sInsta, (t, [post, bubble, pill]) => {
          t.fromTo(post, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
           .fromTo(bubble, { scale: 0, transformOrigin: '100% 100%' }, { scale: 1, ease: SPRING, duration: 0.5 }, '+=0.3')
           .fromTo(pill, { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45 }, '+=0.25')
           .to($('.dot', pill), { scale: 1.8, duration: 0.25, yoyo: true, repeat: 3 })
           .to([post, bubble, pill], { autoAlpha: 0, y: -10, duration: 0.35, stagger: 0.05 }, '+=1.2');
        });
        loop(sMaps, (t, [, pin, card]) => {
          const ring = pin.firstElementChild, drop = pin.lastElementChild;
          t.fromTo(drop, { y: -40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'bounce.out' })
           .fromTo(ring, { scale: 0.3, autoAlpha: 1 }, { scale: 1.6, autoAlpha: 0, duration: 1.1, ease: 'power2.out' }, '-=0.1')
           .fromTo(card, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, '-=0.8')
           .to(card.lastElementChild, { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 }, '+=0.4')
           .to(ring, { scale: 0.3, autoAlpha: 1, duration: 0 })
           .to(ring, { scale: 1.6, autoAlpha: 0, duration: 1.1 })
           .to([drop, card], { autoAlpha: 0, duration: 0.3 }, '+=0.6');
        });
        loop(sAn, (t, [, bars, chart]) => {
          const fills = $$('.h-full', bars), nums = $$('b', bars), [area, line] = $$('path', chart) as unknown as SVGPathElement[], end = $('circle', chart);
          const len = line.getTotalLength();
          t.fromTo(fills, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.8, stagger: 0.12 })
           .add(nums.map(n => countUp(n, { duration: 0.8 })).filter(Boolean) as gsap.core.Tween[], 0)
           .fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0.2)
           .fromTo(area, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.8)
           .fromTo(end, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, ease: SPRING, duration: 0.4 }, 1.2)
           .to({}, { duration: 1.5 });
        });
        loop(sSite, (t, [browser, toast]) => {
          const lines = $$('.rounded-full, .rounded', browser).filter(e => e.offsetHeight < 30 && e.offsetWidth > 20);
          t.fromTo(lines, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.5, stagger: 0.06 })
           .fromTo(toast, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: SPRING }, '+=0.2')
           .to($('.dot', toast), { scale: 1.8, duration: 0.25, yoyo: true, repeat: 3 })
           .to(toast, { x: 60, autoAlpha: 0, duration: 0.35 }, '+=1.4');
        });
        loop(sContent, (t, [reel, right]) => {
          const bar = $('.bg-white', reel), thumbs = $$('.flex.gap-1\\.5 > span', right);
          t.fromTo(bar, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 2.4, ease: 'none' })
           .fromTo($$('.dot', reel), { scale: 0.6 }, { scale: 1, ease: SPRING, duration: 0.6, stagger: 0.1 }, 0)
           .add(() => thumbs.forEach(th => th.classList.remove('ring-2')), 0);
          thumbs.forEach((_, i) => t.add(() => thumbs.forEach((x, j) => x.classList.toggle('ring-2', i === j)), 0.6 * i + 0.2));
        });

        // ---------- 5. «Як ми працюємо»: шлях крапок заповнюється скролом ----------
        // (розкладка різна на mobile і desktop — див. окремі mm.add нижче)

        // звіт (опційний блок): цифри відлічуються, крапки воронки сиплються
        const report = $('#process [role="img"]');
        if (report) {
          const rt = gsap.timeline({ scrollTrigger: { trigger: report, start: 'top 75%' } });
          $$('.font-extrabold, .font-black', report).filter(e => /\d/.test(e.textContent || '') && !e.children.length)
            .forEach(e => { const tw = countUp(e); if (tw) rt.add(tw, 0); });
          rt.from($$('.flex-1 > .dot', report), { scale: 0, stagger: { each: 0.02, from: 'start' }, ease: SPRING, duration: 0.3 }, 0.2);
        }

        // пакет: галочки по черзі
        const pkg = $$('section .border-lime ul li span.grid');
        if (pkg.length) gsap.from(pkg, { scale: 0, rotation: -30, ease: SPRING, stagger: 0.1, scrollTrigger: { trigger: pkg[0], start: 'top 85%' } });

        // FAQ: відповідь проявляється при відкритті
        const onToggle = (e: Event) => {
          const d = e.target as HTMLDetailsElement;
          if (d.open) gsap.from($('p', d), { autoAlpha: 0, y: -8, filter: 'blur(4px)', duration: 0.4, clearProps: 'filter' });
        };
        $$('#faq details').forEach(d => d.addEventListener('toggle', onToggle));

        // крапки біля заголовка форми «пливуть»
        gsap.to($$('#form .dot').slice(0, 3), { y: -6, duration: 0.6, ease: 'sine.inOut', stagger: { each: 0.15, repeat: -1, yoyo: true } });

        ScrollTrigger.refresh();
        return () => {
          calc.removeEventListener('input', onInput);
          mo.disconnect();
          $$('#faq details').forEach(d => d.removeEventListener('toggle', onToggle));
        };
      });

      // «Як ми працюємо», desktop: ряд крапок заповнюється скролом
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
        const ol = $('#process ol')!;
        const seq = gsap.timeline({ scrollTrigger: { trigger: ol, start: 'top 80%', end: 'top 35%', scrub: 0.6 } });
        $$('li', ol).forEach(li => {
          seq.from($('[data-step]', li), { scale: 0.4, backgroundColor: '#2E3035', duration: 0.4 });
          const trail = $$('[data-htrail] .dot', li);
          if (trail.length) seq.from(trail, { scale: 0, backgroundColor: '#2E3035', stagger: 0.08, duration: 0.3 });
        });
      });
      // mobile: крапки кожного кроку «вискакують», коли крок доїжджає до екрана
      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 1023px)', () => {
        $$('#process ol li').forEach(li => gsap.from([$('[data-step]', li), ...$$('[data-vtrail] .dot', li)], {
          scale: 0, stagger: 0.06, ease: SPRING, scrollTrigger: { trigger: li, start: 'top 80%' } }));
      });

      // reduced motion: нічого не ховаємо, відео на паузі
      mm.add('(prefers-reduced-motion: reduce)', () => {
        root.classList.remove('anim');
        $$('video.hero-loop').forEach(v => (v as HTMLVideoElement).pause());
      });
    }).catch(() => root.classList.remove('anim')); // GSAP не завантажився — показуємо статичну сторінку

    return () => { cancelled = true; revert(); };
  }, []);

  return null;
}
