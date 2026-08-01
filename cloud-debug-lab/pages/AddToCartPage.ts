import { expect, type Mobile, type Locator } from 'taqwright';

// Page Object for the "log in → search → add to cart → checkout" flow.
//
// The FLOW is identical on Android and iOS — only the LOCATORS differ. So the flow lives here
// (concrete methods), and the locators are **abstract getters** the platform subclasses fill in.
// A spec talks to this page in user terms (login / searchAndAddToCart), never a raw locator.
export abstract class AddToCartPage {
  constructor(protected readonly mobile: Mobile) {}

  // ── platform-specific locators — provided by AndroidAddToCartPage / IosAddToCartPage ──
  protected abstract usernameField(): Locator;
  protected abstract passwordField(): Locator;
  protected abstract loginButton(): Locator;
  protected abstract viewAllButton(): Locator;
  protected abstract searchField(): Locator;
  protected abstract productCard(): Locator;
  protected abstract addToCartButton(): Locator;
  protected abstract viewCartButton(): Locator;
  protected abstract proceedToCheckout(): Locator;

  // ── shared flow — same on both platforms ──
  async login(username: string, password: string): Promise<void> {
    await this.usernameField().fill(username);
    await this.passwordField().fill(password);
    await this.loginButton().click();
  }

  async openCatalog(): Promise<void> {
    await this.viewAllButton().click();
  }

  async searchAndAddToCart(term: string): Promise<void> {
    await this.searchField().fill(term);
    await this.productCard().click();
    await this.addToCartButton().click();
    await this.viewCartButton().click();
  }

  async expectAtCheckout(): Promise<void> {
    await expect(this.proceedToCheckout()).toBeVisible({ timeout: 20_000 });
  }
}
