import type { Locator } from 'taqwright';
import { AddToCartPage } from './AddToCartPage';

// Android locators (recorded with codegen). Fields have no accessibility id, so we use the
// UiSelector / xpath escape hatches; buttons expose a content-desc → UiSelector().description(...).
export class AndroidAddToCartPage extends AddToCartPage {
  protected usernameField(): Locator {
    return this.mobile.getByXpath("//*[@hint='Username']");
  }
  protected passwordField(): Locator {
    return this.mobile.getByXpath("//*[@hint='Password']");
  }
  protected loginButton(): Locator {
    return this.mobile.getByUiSelector('new UiSelector().description("Login")');
  }
  protected viewAllButton(): Locator {
    return this.mobile.getByUiSelector('new UiSelector().description("View All")');
  }
  protected searchField(): Locator {
    return this.mobile.getByUiSelector('new UiSelector().className("android.widget.EditText")');
  }
  protected productCard(): Locator {
    return this.mobile.getByUiSelector('new UiSelector().descriptionContains("Black Sequin Mini")');
  }
  protected addToCartButton(): Locator {
    return this.mobile.getByUiSelector('new UiSelector().description("Add to Cart")');
  }
  protected viewCartButton(): Locator {
    return this.mobile.getByUiSelector('new UiSelector().description("VIEW CART")');
  }
  protected proceedToCheckout(): Locator {
    return this.mobile.getByUiSelector('new UiSelector().description("Proceed to Checkout")');
  }
}
