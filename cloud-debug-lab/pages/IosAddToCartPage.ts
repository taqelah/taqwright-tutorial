import type { Locator } from 'taqwright';
import { AddToCartPage } from './AddToCartPage';

// iOS locators (recorded with codegen). On iOS the elements expose accessibility ids, so every
// locator is a clean getById(...) — the same flow, much tidier locators than Android.
export class IosAddToCartPage extends AddToCartPage {
  protected usernameField(): Locator {
    return this.mobile.getById('Username');
  }
  protected passwordField(): Locator {
    return this.mobile.getById('Password');
  }
  protected loginButton(): Locator {
    return this.mobile.getById('Login');
  }
  protected viewAllButton(): Locator {
    return this.mobile.getById('View All');
  }
  protected searchField(): Locator {
    return this.mobile.getById('Search dresses...');
  }
  protected productCard(): Locator {
    return this.mobile.getById('Black Sequin Mini\n$119.99');
  }
  protected addToCartButton(): Locator {
    return this.mobile.getById('Add to Cart');
  }
  protected viewCartButton(): Locator {
    return this.mobile.getById('VIEW CART');
  }
  protected proceedToCheckout(): Locator {
    return this.mobile.getById('Proceed to Checkout');
  }
}
