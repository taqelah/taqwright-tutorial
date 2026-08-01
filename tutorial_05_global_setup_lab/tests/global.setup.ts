import { test as setup, expect, type Mobile } from 'taqwright';

// (2) SETUP PROJECT spec — `import { test as setup }`. Unlike the globalSetup module, this
// HAS full device access and runs BEFORE the 'android' project (which declares
// `dependencies: ['setup']`). Use it for device-side prep: sign in, grant permissions,
// dismiss first-run dialogs. It shows up first in the run output / report.

const homeMarker = (mobile: Mobile) => mobile.getByLabel('View All');

setup('sign in once', async ({ mobile }) => {
  await mobile.getByType('android.widget.EditText').nth(0).fill('emma@demoapp.com');
  await mobile.getByType('android.widget.EditText').nth(1).fill('10203040');
  await mobile.getByLabel('Login').click();
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
});
