// Контракт dataLayer (site-spec §9). Код лише пушить події, теги підключає GTM.
type FormId = 'lead' | 'calc';
export type ErrorType = 'validation' | 'turnstile' | 'network' | 'server';

type AnalyticsEvent =
  | { event: 'cta_click'; cta_location: 'header' | 'hero' | 'calculator' | 'services' | 'package' | 'sticky' | 'footer' }
  | { event: 'calc_interact' }
  | { event: 'contact_click'; contact_type: 'phone' | 'instagram' | 'email' | 'telegram' }
  | { event: 'form_start'; form_id: FormId }
  | { event: 'generate_lead'; form_id: FormId; lead_source: string }
  | { event: 'form_error'; form_id: FormId; error_type: ErrorType };

declare global {
  interface Window { dataLayer?: object[] }
}

export function track(e: AnalyticsEvent) {
  (window.dataLayer ||= []).push(e);
}
