import { test, expect, type Mobile } from 'taqwright';
import { readFileSync } from 'node:fs';

// §10 PARAMETERIZE — same idea, but the data comes from an EXTERNAL file, read at
// COLLECTION TIME (before any test runs). Swap the file and the test list changes — no
// code edit. Read via fs + import.meta.url so it works regardless of JSON-import support.

type Account = {
  label: string;
  username: string;
  password: string;
  expectHome: boolean;
};

const accounts = JSON.parse(
  readFileSync(new URL('../data/accounts.json', import.meta.url), 'utf8'),
) as Account[];

const usernameField = (m: Mobile) => m.getByType('android.widget.EditText').nth(0);
const passwordField = (m: Mobile) => m.getByType('android.widget.EditText').nth(1);
const loginButton = (m: Mobile) => m.getByLabel('Login');
const homeMarker = (m: Mobile) => m.getByLabel('View All');

for (const account of accounts) {
  test(`[json] login as ${account.label}`, async ({ mobile }) => {
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
