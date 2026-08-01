# CLAUDE.md — annotations lab

> Claude Code loads this file at the start of every session. Keep it short and current.

## What this is

A mini-project for **§7 · Annotations**. It runs the `taqelah/demo-app` login flow on a local
emulator; the teaching material is the **annotations** in `tests/annotations.spec.ts` (tags,
metadata, `skip`/`fixme`/`fail`/`slow`). taqwright = Playwright runner + flat `mobile` API on Appium 3.x.

- **TypeScript only.** `tests/*.spec.ts` import `{ test, expect } from 'taqwright'`. No node/python dual-stack.
- Use the **`taqwright` skill** for the authoritative `mobile` API, locator priority, and config shape.

## App facts

- Package `com.taqelah.demo_app`; login `emma@demoapp.com` / `10203040`.
- Splash before login — auto-waiting handles it; never `waitForTimeout`.
- Login button accessibility id **`Login`** → `getByLabel('Login')`; home marker **`View All`**.
- Login fields are Flutter `EditText`s with no id → `getByType('android.widget.EditText').nth(0|1)`.

## Conventions

- **Fresh state is config-driven**: `resetBetweenTests: true` + `buildPath: '../app/DemoApp-v1.0.0.apk'`
  + `appBundleId` reinstall the app before each test. No `beforeEach`.
- Keep the annotation variety intact — each test exists to show one modifier; don't collapse them.
- Assert with auto-retrying `expect()`; no hardcoded sleeps.

## Commands

```bash
nvm use 24 && npm install
npx taqwright test --list           # report shows tags / skipped / fixme
npx taqwright test --grep @smoke
npm test
npx taqwright show-report
```
