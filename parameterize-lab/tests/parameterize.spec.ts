import { test, expect, type Mobile } from 'taqwright';

// §10 PARAMETERIZE — loop over a data array and create ONE test() per row.
// `npx taqwright test --list` shows one test per account.
// Fresh state is config-driven (resetBetweenTests + buildPath), so no beforeEach.

type Account = {
  label: string;
  username: string;
  password: string;
  expectHome: boolean; // true → should reach home; false → should stay on login
};

// In a real suite this could come from a CSV/JSON file (see from-json.spec.ts).
const accounts: Account[] = [
  { label: 'standard user', username: 'emma@demoapp.com', password: '10203040', expectHome: true },
  { label: 'wrong password', username: 'emma@demoapp.com', password: 'nope', expectHome: false },
  { label: 'unknown user', username: 'ghost@demoapp.com', password: '10203040', expectHome: false },
];

const usernameField = (m: Mobile) => m.getByType('android.widget.EditText').nth(0);
const passwordField = (m: Mobile) => m.getByType('android.widget.EditText').nth(1);
const loginButton = (m: Mobile) => m.getByLabel('Login');
const homeMarker = (m: Mobile) => m.getByLabel('View All');

for (const account of accounts) {
  test(`login as ${account.label}`, async ({ mobile }) => {
    await usernameField(mobile).fill(account.username);
    await passwordField(mobile).fill(account.password);
    await loginButton(mobile).click();

    if (account.expectHome) {
      await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
    } else {
      await expect(homeMarker(mobile)).not.toBeVisible();
      await expect(loginButton(mobile)).toBeVisible();
    }
  });
}
