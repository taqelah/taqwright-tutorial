import { test, expect, type Mobile } from 'taqwright';

// One of several specs so `fullyParallel` + `workers: 2` have work to spread across devices.
// Fresh state is config-driven (resetBetweenTests + buildPath).

const loginScreen = (mobile: Mobile) => mobile.getByLabel('Login');

test('the app launches to the login screen', async ({ mobile }) => {
  await expect(loginScreen(mobile)).toBeVisible({ timeout: 20_000 });
});
