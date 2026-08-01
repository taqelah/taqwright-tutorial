import { test, expect, type Mobile } from 'taqwright';

// §17 RETRIES — a deterministically "flaky" test. It FAILS on the first attempt and PASSES on a
// retry, so the runner reports it as **flaky** (not failed). The attempt number comes from
// `testInfo.retry` (0 on the first run, then 1, 2…). With `retries: 2` in the config, attempt 0
// fails the assertion below, the test reruns from a FRESH session, and attempt 1 passes.

const USERNAME = 'emma@demoapp.com';
const PASSWORD = '10203040';
const homeMarker = (m: Mobile) => m.getByLabel('View All');

test('flaky: passes only on a retry', async ({ mobile }, testInfo) => {
  // real mobile work — reinstalled + logged in fresh on every attempt (resetBetweenTests)
  await mobile.getByType('android.widget.EditText').nth(0).fill(USERNAME);
  await mobile.getByType('android.widget.EditText').nth(1).fill(PASSWORD);
  await mobile.getByLabel('Login').click();
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });

  // the simulated flake: fails on attempt 0 (retry === 0), passes once it's a retry.
  expect(testInfo.retry, 'simulated flake — clears on retry').toBeGreaterThan(0);
});
