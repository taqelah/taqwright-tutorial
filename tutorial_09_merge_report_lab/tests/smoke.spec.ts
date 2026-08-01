import { test, expect, type Mobile } from 'taqwright';

// The second spec FILE — shard 2/2 picks this up while shard 1/2 runs login.spec.ts.

const loginButton = (m: Mobile) => m.getByLabel('Login');
const usernameField = (m: Mobile) => m.getByType('android.widget.EditText').nth(0);

test('the app launches to the login screen', async ({ mobile }) => {
  await expect(loginButton(mobile)).toBeVisible({ timeout: 20_000 });
});

test('the username field is editable', async ({ mobile }) => {
  await usernameField(mobile).fill('emma@demoapp.com');
  await expect(usernameField(mobile)).toBeVisible();
});
