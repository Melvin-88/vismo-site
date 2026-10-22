import { getAttribution } from './attribution';
import { track, type ErrorType } from './analytics';
import type { LeadFields } from './validate';

export type LeadPayload = LeadFields & { form: 'lead' | 'calc'; website: string; turnstile: string };

// POST /api/lead → Pages Function. generate_lead тільки після 200 ok.
export async function sendLead(p: LeadPayload): Promise<ErrorType | null> {
  const attribution = getAttribution();
  let res: Response;
  try {
    res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, attribution }),
    });
  } catch {
    track({ event: 'form_error', form_id: p.form, error_type: 'network' });
    return 'network';
  }
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: ErrorType };
  if (res.ok && data.ok) {
    track({ event: 'generate_lead', form_id: p.form, lead_source: attribution.utm_source || 'direct' });
    return null;
  }
  const error_type = data.error === 'turnstile' || data.error === 'validation' ? data.error : 'server';
  track({ event: 'form_error', form_id: p.form, error_type });
  return error_type;
}
