import { test, expect } from '@taqwright/taqwright';

// ─── Example tests (demo app) ────────────────────────────────────
// Run against the bundled demo app (app/DemoApp-v1.0.0.apk). The
// config sets resetBetweenTests:true, so taqwright reinstalls +
// relaunches it fresh before each test — every test starts at the
// login screen. `npx taqwright test` should pass once a device /
// emulator is up. (Android selectors — the demo app is an APK.)
test('user can log in to the demo app', async ({ mobile }) => {
  await mobile.getByXpath("//*[@hint='Username']").fill('emma@demoapp.com');
  await mobile.getByXpath("//*[@hint='Password']").fill('10203040');
  await mobile.getByUiSelector('new UiSelector().description("Login")').click();
  await expect(mobile.getByUiSelector('new UiSelector().description("View All")')).toBeVisible();
});

test('login fails with invalid username & password', async ({ mobile }) => {
  await mobile.getByXpath("//*[@hint='Username']").fill('invalidusername');
  await mobile.getByXpath("//*[@hint='Password']").fill('invalidpassword');
  await mobile.getByUiSelector('new UiSelector().description("Login")').click();
  await expect(mobile.getByXpath("//*[contains(@content-desc, 'Invalid username or password.')]")).toBeVisible();
});

test('login is blocked without username & password', async ({ mobile }) => {
  await mobile.getByUiSelector('new UiSelector().description("Login")').click();
  await expect(mobile.getByUiSelector('new UiSelector().description("Please enter your username")')).toBeVisible();
  await expect(mobile.getByUiSelector('new UiSelector().description("Please enter your password")')).toBeVisible();
});

test("add to cart", async ({ mobile }) => {
  await mobile.getByXpath("//*[@hint='Username']").fill("emma@demoapp.com");
  await mobile.getByXpath("//*[@hint='Password']").fill("10203040");
  await mobile.getByUiSelector("new UiSelector().description(\"Login\")").click();
  await mobile.getByUiSelector("new UiSelector().description(\"View All\")").click();
  await mobile.getByUiSelector("new UiSelector().descriptionContains(\"Black Sequin Mini\")").click();
  await mobile.getByUiSelector("new UiSelector().description(\"Add to Cart\")").click();
  await mobile.getByUiSelector("new UiSelector().description(\"VIEW CART\")").click();
  await expect(mobile.getByUiSelector("new UiSelector().description(\"Proceed to Checkout\")")).toBeVisible();
});
