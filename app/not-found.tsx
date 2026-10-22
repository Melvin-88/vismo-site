import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

// noindex Next.js додає до not-found сам
export const metadata: Metadata = { title: 'Сторінку не знайдено — Vismo' };

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-x section-y flex min-h-[60vh] flex-col items-start justify-center">
        <div className="flex items-center gap-[6px]" aria-hidden="true"><span className="dot h-[14px] w-[14px] bg-lime" /><span className="dot h-[9px] w-[9px] bg-lime" /><span className="dot h-[6px] w-[6px] bg-lime" /></div>
        <h1 className="mt-6 text-[35px] font-extrabold leading-[1.15] lg:text-[58px]">Сторінку не знайдено</h1>
        <p className="mt-4 text-[17px] text-gray">Можливо, посилання застаріло або в ньому помилка.</p>
        <a href="/" className="btn btn-primary mt-8">На головну</a>
      </main>
      <Footer />
    </>
  );
}
