import { test, expect, type Mobile } from 'taqwright';

// §7 ANNOTATIONS — every test modifier + metadata taqwright inherits from the Playwright runner.
// See how each is reported:  npx taqwright test --list
// Fresh state is config-driven (resetBetweenTests + buildPath), so no beforeEach is needed.

const USERNAME = 'emma@demoapp.com';
const PASSWORD = '10203040';
const isCI = !!process.env.CI;

const login = async (mobile: Mobile) => {
  await mobile.getByType('android.widget.EditText').nth(0).fill(USERNAME);
  await mobile.getByType('android.widget.EditText').nth(1).fill(PASSWORD);
  await mobile.getByLabel('Login').click();
};
const homeMarker = (mobile: Mobile) => mobile.getByLabel('View All');

// ─── tags & metadata (slide 51) ──────────────────────────────────────────
// Tag → run just these with `--grep @smoke`, or exclude with `--grep-invert @smoke`.
test('login is a smoke test', { tag: '@smoke' }, async ({ mobile }) => {
  await login(mobile);
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
});

// Multiple tags on one test.
test('checkout path', { tag: ['@smoke', '@checkout'] }, async ({ mobile }) => {
  await login(mobile);
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
});

// Freeform metadata — surfaces in the HTML report; does not change execution.
test(
  'login keeps a paper trail',
  { annotation: { type: 'issue', description: 'TAQ-482' } },
  async ({ mobile }) => {
    await login(mobile);
    await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
  },
);

// ─── control execution (slide 50) ────────────────────────────────────────
// Unconditionally skipped — a feature not built yet. Never runs.
test.skip('apple-pay checkout', async ({ mobile }) => {
  await expect(mobile.getByLabel('Apple Pay')).toBeVisible();
});

// Conditionally skipped — e.g. only on CI.
test('biometric prompt', async ({ mobile }) => {
  test.skip(isCI, 'fingerprint sensor unavailable on CI emulators');
  await login(mobile);
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
});

// Known-broken — won't run and won't fail the suite until someone fixes it.
test.fixme('biometric login (flaky on emulator)', async ({ mobile }) => {
  await mobile.getByLabel('Use fingerprint').click();
  await expect(homeMarker(mobile)).toBeVisible();
});

// Expected failure — the suite PASSES *because* this test fails (a tracked bug).
test.fail('wrong password must not reach home (TAQ-9)', async ({ mobile }) => {
  await mobile.getByType('android.widget.EditText').nth(0).fill(USERNAME);
  await mobile.getByType('android.widget.EditText').nth(1).fill('wrong-password');
  await mobile.getByLabel('Login').click();
  // This assertion fails (home never appears) → test.fail turns that into a pass.
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 5_000 });
});

// Long flow — triples the test timeout instead of bumping it everywhere.
test('a deliberately slow flow', async ({ mobile }) => {
  test.slow();
  await login(mobile);
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
});
