# CLAUDE.md — global setup & teardown lab

> Claude Code loads this file at the start of every session. Keep it short and current.

## What this is

A mini-project for **§8 · Global setup & teardown**. It demonstrates the two "around the run"
mechanisms against `taqelah/demo-app` (Flutter, Android): a no-device `globalSetup`/`globalTeardown`
module, and a device-access **setup project** that the main `android` project depends on. taqwright =
Playwright runner + flat `mobile` API on Appium 3.x.

- **TypeScript only**; `tests/*.spec.ts` + `tests/global.setup.ts` import from `'taqwright'`.
- Use the **`taqwright` skill** for the authoritative `mobile` API, locator priority, config shape.

## App facts

- Package `com.taqelah.demo_app`; login `emma@demoapp.com` / `10203040`.
- Login button accessibility id **`Login`** → `getByLabel('Login')`; home marker **`View All`**.
- Login fields are Flutter `EditText`s with no id → `getByType('android.widget.EditText').nth(0|1)`.

## Conventions

- **Fresh state is config-driven**: `resetBetweenTests: true` + `buildPath: '../app/DemoApp-v1.0.0.apk'`
  + `appBundleId`. No `beforeEach`.
- The **setup project** uses `import { test as setup }` and `testMatch: /global\.setup\.ts/`; the
  `android` project sets `dependencies: ['setup']` so setup runs first.
- The **globalSetup module** has NO device and runs in the main process — don't rely on its
  `process.env` reaching workers; keep it to logging / file / API work.
- **`tests/hooks.spec.ts`** demonstrates the spec-level hooks (`beforeAll`/`afterAll`,
  `beforeEach`/`afterEach`) with `console.log` — logging only; fresh state stays config-driven.

## Commands

```bash
nvm use 24 && npm install
npx taqwright test --list     # both projects: setup + android
npm test                      # order: [globalSetup] → setup → android → [globalTeardown]
npx taqwright show-report
```
