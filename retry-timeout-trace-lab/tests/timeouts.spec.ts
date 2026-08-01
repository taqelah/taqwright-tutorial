import { test, expect, type Mobile } from 'taqwright';

// §18 TIMEOUTS — two budgets:
//   • whole-test  → `test.setTimeout(ms)` (or `test.slow()` = 3× the default 60s)
//   • expect/action → global `expectTimeout` (30s), overridden per call with `{ timeout }`

const USERNAME = 'emma@demoapp.com';
const PASSWORD = '10203040';
const homeMarker = (m: Mobile) => m.getByLabel('View All');

test('a slow flow gets a bigger budget', async ({ mobile }) => {
  test.setTimeout(120_000); // this whole test may take up to 120s (default is 60s)
  // test.slow();           // …or triple the default instead of a fixed number

  await mobile.getByType('android.widget.EditText').nth(0).fill(USERNAME);
  await mobile.getByType('android.widget.EditText').nth(1).fill(PASSWORD);
  await mobile.getByLabel('Login').click();

  // per-assertion timeout — overrides the global expectTimeout just for this wait
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 10_000 });
});
