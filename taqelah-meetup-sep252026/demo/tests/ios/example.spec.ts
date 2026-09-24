import { test, expect } from '@taqwright/taqwright';

// ─── First test ──────────────────────────────────────────────────
// Runs without an app installed — just confirms the device + Appium
// stack is wired up. Fill in your own `buildPath` + `appBundleId`
// in taqwright.config.ts then write a real test below.
test('screen has positive dimensions', async ({ mobile }) => {
  const size = await mobile.getScreenSize();
  expect(size.width).toBeGreaterThan(0);
  expect(size.height).toBeGreaterThan(0);
});


test("Add to Cart", async ({ mobile }) => {
  await mobile.getById("Username").fill("emma@demoapp.com");
  await mobile.getById("Password").fill("10203040");
  await mobile.getById("Login").click();
  await mobile.getById("View All").click();
  await mobile.getById("Black Sequin Mini\n$119.99").click();
  await mobile.getById("Add to Cart").click();
  await mobile.getById("VIEW CART").click();
  await expect(mobile.getById("Proceed to Checkout")).toBeVisible();
});

// ─── Realistic-shape example (commented) ─────────────────────────
// Uncomment after pointing the config at your app. Showcases the
// idiomatic taqwright surface:
//
//   * Locator entry points: getById / getByText / getByLabel / getByRole / ...
//   * Chain methods:        .first() / .nth(i) / .filter({ hasText }) / .locator(child) / .all()
//   * Auto-retrying matchers (Playwright-style) on a Locator:
//                           await expect(loc).toBeVisible() / .toHaveText() / .toBeChecked() / .toHaveCount(n) / ...
//   * Plain `expect(value)` (no await) for numbers, strings, arrays.
//
// test('login flow', async ({ mobile }) => {
//   await mobile.getById('Username').fill('demo@example.com');
//   await mobile.getById('Password').fill('hunter2');
//   await mobile.getByRole('button', { name: 'Sign in' }).click();
//
//   // Auto-waits up to expectTimeout for the heading to appear.
//   await expect(mobile.getByText('Welcome')).toBeVisible();
//
//   // Chain — disambiguate the 3rd row in a repeating list.
//   await mobile.getByType('XCUIElementTypeCell').nth(2).click();
//
//   // Filter — pick the Wi-Fi row by its label, then tap its switch.
//   await mobile.getByType('android.widget.LinearLayout')
//     .filter({ hasText: 'Wi-Fi' })
//     .locator(mobile.getByType('android.widget.Switch'))
//     .check();
//
//   // Plain-value expect — for non-Locator data.
//   const items = await mobile.getByType('CartItem').all();
//   expect(items).toHaveLength(3);
// });

// ─── Pause for interactive debugging (commented) ─────────────────
// Drop this anywhere in a test to hand off to the inspector. The
// in-flight WebDriver session is attached (no new Appium boot), the
// inspector opens in your browser, and the test resumes when you
// click "Resume" in the UI. Set `PWDEBUG=0` in CI to make it a
// no-op without removing the call.
//
// test('paused for inspection', async ({ mobile }) => {
//   await mobile.getById('Login').click();
//   await mobile.pause();      // ← browser opens; click around; click Resume
//   await expect(mobile.getByText('Dashboard')).toBeVisible();
// });
