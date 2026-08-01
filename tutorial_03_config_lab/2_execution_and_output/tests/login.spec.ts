import { test, expect, type Mobile } from 'taqwright';

// Shared login spec — every tutorial_03_config_lab mini-project runs this same flow, so the only thing
// that changes between folders is the taqwright.config.ts (that's the lesson).
// Field locators: Flutter EditTexts with no label → type + index. Fresh state is config-driven
// (resetBetweenTests + buildPath), so no beforeEach is needed.

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
