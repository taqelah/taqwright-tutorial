import type { Mobile } from 'taqwright';

import type { LoginPage } from './login/LoginPage';
import { AndroidLoginPage } from './login/AndroidLoginPage';
import { IosLoginPage } from './login/IosLoginPage';

import type { HomePage } from './home/HomePage';
import { AndroidHomePage } from './home/AndroidHomePage';
import { IosHomePage } from './home/IosHomePage';

import type { SearchCataloguePage } from './search-catalogue/SearchCataloguePage';
import { AndroidSearchCataloguePage } from './search-catalogue/AndroidSearchCataloguePage';
import { IosSearchCataloguePage } from './search-catalogue/IosSearchCataloguePage';

import type { CartPage } from './cart/CartPage';
import { AndroidCartPage } from './cart/AndroidCartPage';
import { IosCartPage } from './cart/IosCartPage';

export type { LoginPage } from './login/LoginPage';
export type { HomePage } from './home/HomePage';
export type { SearchCataloguePage } from './search-catalogue/SearchCataloguePage';
export type { CartPage } from './cart/CartPage';

// One factory per screen: pick the platform's subclass from the running project's name.
// Specs only ever touch the abstract page types — the flow methods chain from one factory to the
// next (loginPage → homePage → searchCataloguePage → cartPage).
//
// ⚠️ The ONLY difference from tutorial_11_page_object_lab's identical file: this lab's projects are
// named 'android' · 'browserstack-android' · 'browserstack-ios', so the test is `includes('ios')`
// rather than `=== 'ios'`. Otherwise 'browserstack-ios' would fall through to the Android pages.
const isIos = (projectName: string) => projectName.includes('ios');
export function loginPage(mobile: Mobile, projectName: string): LoginPage {
  return isIos(projectName)
    ? new IosLoginPage(mobile, projectName)
    : new AndroidLoginPage(mobile, projectName);
}

export function homePage(mobile: Mobile, projectName: string): HomePage {
  return isIos(projectName)
    ? new IosHomePage(mobile, projectName)
    : new AndroidHomePage(mobile, projectName);
}

export function searchCataloguePage(mobile: Mobile, projectName: string): SearchCataloguePage {
  return isIos(projectName)
    ? new IosSearchCataloguePage(mobile, projectName)
    : new AndroidSearchCataloguePage(mobile, projectName);
}

export function cartPage(mobile: Mobile, projectName: string): CartPage {
  return isIos(projectName)
    ? new IosCartPage(mobile, projectName)
    : new AndroidCartPage(mobile, projectName);
}
