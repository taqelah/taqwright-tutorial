# CLAUDE.md — cloud lab (BrowserStack)

> Claude Code loads this file at the start of every session. Keep it short and current.

## What this is

Runs the **page-object add-to-cart spec** on a local emulator **and** on **BrowserStack**. Three
projects (`android`, `browserstack-android`, `browserstack-ios`); the spec + `pages/` are identical
across all of them — only `device.provider` changes.

`pages/` and `tests/add-to-cart.spec.ts` are **verbatim copies of `../tutorial_11_page_object_lab/`**
(labs are standalone npm projects, so nothing is imported across them). One page object per screen
(`login/` · `home/` · `search-catalogue/` · `cart/`), each a base + `Android*`/`Ios*` subclasses, with
fluent screen-to-screen chaining. **Keep them in sync** — if you change a page object here, mirror it
in lab 11 (and vice versa). The single intentional difference is in `pages/index.ts`: factories match
`projectName.includes('ios')` because the cloud projects are `browserstack-ios` / `browserstack-android`. taqwright = Playwright runner + flat `mobile` API on Appium 3.x.

- **TypeScript only**; `pages/` (base + Android/iOS subclasses + factory) and `tests/add-to-cart.spec.ts`.
- `Mobile` and `Locator` are exported from `taqwright`; the factory picks the subclass by `testInfo.project.name`.

## Cloud rules (don't break these)

- **Only the project's `use` changes** for the cloud: `device.provider: 'browserstack'` + required
  `name`/`osVersion`; **no** local `appium` block; creds via **env** (`BROWSERSTACK_USERNAME` /
  `BROWSERSTACK_ACCESS_KEY`), never in the config.
- `buildPath` = a local `.apk` (uploaded on run) or `TAQ_APK="bs://<app-id>"` (pre-uploaded).
- Cloud parallelism = `workers: N` (one device per session, no `device.pool`); raise
  `appium.connectionTimeout`. Vendor options via `capabilities → 'bstack:options'`.
- App ids: Android `com.taqelah.demo_app`; iOS `com.taqelah.demoApp`.
- Keep flow in the base page object; locators in the subclasses; no raw locators / platform `if`s in the spec.

## Commands

```bash
nvm use 24 && npm install
npm run test:local          # local emulator
npm run test:cloud-android  # BrowserStack Android (creds from .env)
npm run test:cloud-ios      # BrowserStack iOS
npx taqwright show-report
```
