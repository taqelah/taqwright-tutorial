import { test, expect, type Mobile } from 'taqwright';

// Runs under the `ios` project (testDir: ./tests/ios). macOS + a booted iPhone simulator + the
// .app build required. On iOS the fields/button/marker expose accessibility ids → getById(...)
// (recorded with codegen). Fresh state is config-driven (resetBetweenTests + buildPath).

const homeMarker = (m: Mobile) => m.getById('View All');

test('a valid user can log in (iOS)', async ({ mobile }) => {
  await mobile.getById('Username').fill('emma@demoapp.com');
  await mobile.getById('Password').fill('10203040');
  await mobile.getById('Login').click();
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
});
