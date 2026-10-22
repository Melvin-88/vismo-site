'use client';
import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import { captureAttribution } from '@/lib/attribution';

// Один делегований слухач: серверні компоненти лише ставлять data-cta / data-contact
export function Tracking() {
  useEffect(() => {
    captureAttribution();
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest<HTMLElement>('[data-cta], [data-contact]');
      if (!el) return;
      const { cta, contact } = el.dataset;
      if (cta) track({ event: 'cta_click', cta_location: cta as never });
      if (contact) track({ event: 'contact_click', contact_type: contact as never });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
