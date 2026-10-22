'use client';
import { useEffect, useState } from 'react';

// Mobile: зʼявляється після hero, ховається, коли у полі зору форма або футер
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const els = ['hero', 'form'].map(id => document.getElementById(id)).concat(document.querySelector('footer'));
    if (els.some(e => !e)) return;
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => visible.set(e.target, e.isIntersecting));
      setShow(![...visible.values()].some(Boolean));
    });
    els.forEach(e => io.observe(e!));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-graphite-3 bg-[rgba(30,31,34,.92)] p-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${show ? 'translate-y-0' : 'pointer-events-none translate-y-full'}`}
      aria-hidden={!show}
    >
      <a href="#form" data-cta="sticky" tabIndex={show ? 0 : -1} className="btn btn-primary w-full">Отримати безкоштовний розбір</a>
    </div>
  );
}
