// Контракт dataLayer (site-spec §9). Код лише пушить події, теги підключає GTM.
type FormId = 'lead' | 'calc';
export type ErrorType = 'validation' | 'turnstile' | 'network' | 'server';

type AnalyticsEvent =
  | { event: 'cta_click'; cta_location: 'header' | 'hero' | 'calculator' | 'services' | 'package' | 'sticky' | 'footer' }
  | { event: 'calc_interact' }
  | { event: 'contact_click'; contact_type: 'phone' | 'instagram' | 'email' | 'telegram' }
  | { event: 'form_start'; form_id: FormId }
  | { event: 'generate_lead'; form_id: FormId }
  | { event: 'form_error'; form_id: FormId; error_type: ErrorType };

declare global {
  interface Window { dataLayer?: object[] }
}

// Усі параметри подій. GTM пам'ятає значення між push, тож кожна подія явно затирає чужі параметри,
// інакше, напр., cta_click піде в GA4 з form_id від попереднього form_start.
const PARAMS = ['form_id', 'cta_location', 'contact_type', 'error_type'] as const;

export function track(e: AnalyticsEvent) {
  (window.dataLayer ||= []).push({ ...Object.fromEntries(PARAMS.map(k => [k, undefined])), ...e });
}
