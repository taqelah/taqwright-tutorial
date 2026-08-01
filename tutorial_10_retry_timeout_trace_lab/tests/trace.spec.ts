import { test, expect, type Mobile } from 'taqwright';

// §19 TRACE VIEWER — nothing special in the test; `trace: 'on'` in the config captures a trace for
// EVERY test (incl. the flaky test's failed attempt). After running:
//   npx taqwright show-report  → open this test → the "taqwright-trace" attachment
//   …step the clickable timeline: screenshot + page-source XML after each action.

const USERNAME = 'emma@demoapp.com';
const PASSWORD = '10203040';
const homeMarker = (m: Mobile) => m.getByLabel('View All');

test('login — open this trace in the report', async ({ mobile }) => {
  await mobile.getByType('android.widget.EditText').nth(0).fill(USERNAME);
  await mobile.getByType('android.widget.EditText').nth(1).fill(PASSWORD);
  await mobile.getByLabel('Login').click();
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
});
