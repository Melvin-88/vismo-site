'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type TurnstileApi = {
  render: (el: HTMLElement, o: { sitekey: string; language?: string; callback: (t: string) => void; 'expired-callback': () => void }) => string;
  reset: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi; onTurnstileLoad?: () => void } }

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';
const waiters: (() => void)[] = [];

// Скрипт вантажиться один раз на сторінку, навіть якщо віджетів два (калькулятор + форма)
function whenReady(cb: () => void) {
  if (window.turnstile) return cb();
  waiters.push(cb);
  if (document.querySelector(`script[src="${SRC}"]`)) return;
  window.onTurnstileLoad = () => waiters.splice(0).forEach(f => f());
  const s = document.createElement('script');
  s.src = SRC; s.async = true; s.defer = true;
  document.head.append(s);
}

export type TurnstileHandle = { token: () => string; reset: () => void };

export const Turnstile = forwardRef<TurnstileHandle>(function Turnstile(_, ref) {
  const box = useRef<HTMLDivElement>(null);
  const token = useRef('');
  const id = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    token: () => token.current,
    reset: () => { token.current = ''; if (id.current && window.turnstile) window.turnstile.reset(id.current); },
  }));

  useEffect(() => {
    if (!SITE_KEY || !box.current) return; // локально без ключа віджет не показуємо; Function відхилить заявку
    // скрипт вантажимо, лише коли форма підʼїжджає до екрана — не заважає першому рендеру
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      whenReady(() => {
        if (!box.current || id.current) return;
        id.current = window.turnstile!.render(box.current, {
          sitekey: SITE_KEY, language: 'uk',
          callback: t => { token.current = t; },
          'expired-callback': () => { token.current = ''; },
        });
      });
    }, { rootMargin: '600px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return <div ref={box} className="mt-5 min-h-[65px]" />;
});
