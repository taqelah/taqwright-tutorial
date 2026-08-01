# CLAUDE.md — setup lab

> Claude Code loads this file at the start of every session. It tells Claude what this
> project is so its output matches the house style. Keep it short and current.

## What this project is

The **environment setup** lab — the one-time install/provision/verify step before
any taqwright test. Goal: a green `npx taqwright doctor`, a targeted device, and a passing
**smoke** run that just launches **`taqelah/demo-app`** (a Flutter app) and confirms its login
screen renders. The real login flow lives in the per-topic labs (e.g. `../tutorial_03_config_lab/`, `../tutorial_06_parallel_lab/`).

- **TypeScript only.** Tests are `tests/*.spec.ts` that `import { test, expect } from 'taqwright'`
  (the Playwright runner with a flat `mobile` locator API on Appium 3.x / UiAutomator2, Android).
  There is **no `node/` + `python/` dual-stack** — that's the Appium-by-hand pattern.
- **Use the `taqwright` skill** when writing or running tests — it's the authoritative reference
  for the `mobile` API, the locator-priority table, and config shape.

## App facts

- App package: `com.taqelah.demo_app`  (set as `appBundleId` in `taqwright.config.ts`)
- Login credentials: `emma@demoapp.com` / `10203040`  (the smoke test does NOT log in)
- There is a **splash screen** before login — auto-waiting locators handle it; never `waitForTimeout`.
- The login submit button has accessibility id **`Login`** → `getByLabel('Login')` (the smoke marker).
- Post-login home is identified by accessibility id **`View All`** → `getByLabel('View All')`.

## Conventions

- **Inspect first.** Confirm every locator against the live UI tree (`npx taqwright inspect`
  or `await mobile.viewTree()`) before trusting it. Never guess.
- **Locator priority:** `getById`/`getByTestId` → `getByLabel` → `getByRole` → `getByText`
  → `getByType` (last resort). xpath / UiSelector are escape hatches only.
- **Assert with auto-retrying `expect()`** — `await expect(loc).toBeVisible()`, never a raw
  `isVisible()` boolean. No hardcoded sleeps; actions and matchers auto-wait.
- **Fresh state per test** — config-driven: `resetBetweenTests: true` + `buildPath` reinstall
  the APK before each test (no `beforeEach` needed). `buildPath` points at the shared, committed
  `../app/DemoApp-v1.0.0.apk` — nothing to download.

## Commands

```bash
nvm use 24                 # taqwright needs Node 24+
npm install                # installs @taqwright/taqwright (aliased to `taqwright`)
npx taqwright install      # provision JDK + Android SDK + Appium (skip if you have your own)
npx taqwright doctor       # verify env — Node 24 is the only hard fail
npx taqwright devices      # list emulators — copy the AVD id into taqwright.config.ts
npm test                   # run the smoke spec (Appium auto-starts)
npx taqwright show-report  # open the HTML report (trace on failures)
```

## Guardrails

- Don't invent locators — confirm them against the running app (inspect) or the existing spec.
- Keep the smoke test minimal — it proves the toolchain, not the login flow.
- Always review generated tests by running them; a test that never fails is worthless.
