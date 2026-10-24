// npm test — track(): кожна подія затирає параметри попередніх (GTM пам'ятає їх між push)
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('track: параметри не «залипають» між подіями', async () => {
  globalThis.window = {};
  const { track } = await import('./analytics.ts');
  track({ event: 'form_start', form_id: 'lead' });
  track({ event: 'cta_click', cta_location: 'calculator' });
  const [a, b] = window.dataLayer;
  assert.equal(a.form_id, 'lead');
  assert.ok('form_id' in b && b.form_id === undefined);
  assert.equal(b.cta_location, 'calculator');
});
