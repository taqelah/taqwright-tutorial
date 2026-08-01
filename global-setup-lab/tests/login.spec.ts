import { test, expect, type Mobile } from 'taqwright';

// The real 'android' tests. They run only AFTER the 'setup' project completes
// (dependencies: ['setup']) and AFTER the no-device globalSetup module.
// Fresh state is config-driven (resetBetweenTests + buildPath), so no beforeEach.

const homeMarker = (mobile: Mobile) => mobile.getByLabel('View All');

test('a valid user can log in', async ({ mobile }) => {
  await mobile.getByType('android.widget.EditText').nth(0).fill('emma@demoapp.com');
  await mobile.getByType('android.widget.EditText').nth(1).fill('10203040');
  await mobile.getByLabel('Login').click();
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
});
