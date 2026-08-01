import { test, expect } from 'taqwright';

// Smoke test — proves the whole toolchain works end to end:
// install → device → Appium auto-start → app launch → a locator resolves.
// It does NOT log in; it just confirms the demo-app reaches its login screen.
// Green here = your environment is ready; move on to the per-topic labs (e.g. ../config-lab/).
//
// Fresh state comes from the config: resetBetweenTests + buildPath reinstall the
// APK and relaunch the app before every test — no manual beforeEach needed.

test('the demo app launches and shows the login screen', async ({ mobile }) => {
  await expect(mobile.getByLabel('Login')).toBeVisible({ timeout: 20_000 });
});
