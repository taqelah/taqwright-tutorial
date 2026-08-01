import type { Mobile } from 'taqwright';
import type { AddToCartPage } from './AddToCartPage';
import { AndroidAddToCartPage } from './AndroidAddToCartPage';
import { IosAddToCartPage } from './IosAddToCartPage';

export type { AddToCartPage } from './AddToCartPage';

// Pick the platform's page object from the running project's name. Any project whose name contains
// "ios" (e.g. 'ios', 'browserstack-ios') gets the iOS page; everything else gets Android.
// The spec stays platform-agnostic — it only ever sees the AddToCartPage interface.
export function addToCartPage(mobile: Mobile, projectName: string): AddToCartPage {
  return projectName.includes('ios')
    ? new IosAddToCartPage(mobile)
    : new AndroidAddToCartPage(mobile);
}
