import { test, expect, type Mobile } from 'taqwright';

// Two tests here + the smoke spec = three across the suite, so 2 workers actually fan out.

const USERNAME = 'emma@demoapp.com';
const PASSWORD = '10203040';

const usernameField = (m: Mobile) => m.getByType('android.widget.EditText').nth(0);
const passwordField = (m: Mobile) => m.getByType('android.widget.EditText').nth(1);
const loginButton = (m: Mobile) => m.getByLabel('Login');
const homeMarker = (m: Mobile) => m.getByLabel('View All');

test('a valid user can log in', async ({ mobile }) => {
  await usernameField(mobile).fill(USERNAME);
  await passwordField(mobile).fill(PASSWORD);
  await loginButton(mobile).click();
  await expect(homeMarker(mobile)).toBeVisible({ timeout: 20_000 });
});

test('a wrong password stays on the login screen', async ({ mobile }) => {
  await usernameField(mobile).fill(USERNAME);
  await passwordField(mobile).fill('wrong-password');
  await loginButton(mobile).click();
  await expect(homeMarker(mobile)).not.toBeVisible();
  await expect(loginButton(mobile)).toBeVisible();
});
