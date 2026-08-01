import { test } from 'taqwright';
import { addToCartPage } from '../pages';

// ONE spec, BOTH platforms. The page object hides the Android/iOS locator differences; the factory
// picks the right subclass from the running project's name. Run either target:
//   npx taqwright test --project android
//   npx taqwright test --project ios
// Notice the test body has NO raw locators and NO `if (android) … else …` — just the user flow.
test('search a dress and add it to the cart', async ({ mobile }, testInfo) => {
  const page = addToCartPage(mobile, testInfo.project.name);

  await page.login('emma@demoapp.com', '10203040');
  await page.openCatalog();
  await page.searchAndAddToCart('black');
  await page.expectAtCheckout();
});
