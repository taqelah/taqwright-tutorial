import { test, expect, type Mobile } from 'taqwright';

// (3) SPEC-LEVEL HOOKS — the in-worker counterparts to globalSetup/globalTeardown.
// Unlike the globalSetup MODULE, these run inside a worker and HAVE the `mobile` device fixture.
// Run `npm test` and read the console to see the order:
//   [beforeAll]  →  ([beforeEach] → test → [afterEach]) × 2  →  [afterAll]
//
// NB: per-test fresh state in these labs comes from `resetBetweenTests` (config), NOT from a
// beforeEach. The beforeEach below is here purely to SHOW the lifecycle/order.

const loginScreen = (mobile: Mobile) => mobile.getByLabel('Login');

test.beforeAll(async () => {
  console.log('  [beforeAll]   once per FILE — prep shared by this file (open a screen, seed once)');
});

test.afterAll(async () => {
  console.log('  [afterAll]    once per FILE — tear down what beforeAll set up');
});

test.beforeEach(async () => {
  console.log('    [beforeEach] before EVERY test — reset state / navigate to a start point');
});

test.afterEach(async () => {
  console.log('    [afterEach]  after EVERY test');
});

test('first test sees the login screen', async ({ mobile }) => {
  await expect(loginScreen(mobile)).toBeVisible({ timeout: 20_000 });
});

test('second test sees it too — hooks run again', async ({ mobile }) => {
  await expect(loginScreen(mobile)).toBeVisible({ timeout: 20_000 });
});
