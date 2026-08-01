# CLAUDE.md — projects lab

> Claude Code loads this file at the start of every session. Keep it short and current.

## What this is

A mini-project for **§14 · Projects**. `taqwright.config.ts` defines **two device-target projects** —
`android` and `ios` — each with its own `testDir` + `use`, running its own login spec against
`taqelah/demo-app`. Run one with `npx taqwright test --project <name>`. taqwright = Playwright runner
+ flat `mobile` API on Appium 3.x.

- **TypeScript only**; android specs in `tests/android/`, iOS in `tests/ios/` (per-project `testDir`).
- Use the **`taqwright` skill** for the authoritative `mobile` API, locator priority, config shape.

## Key facts

- Android package `com.taqelah.demo_app`; **iOS bundle id is camelCase `com.taqelah.demoApp`**.
- Login `emma@demoapp.com` / `10203040`; button `getByLabel('Login')`; home marker `getByLabel('View All')`.
- Android fields have **no id** → `getByType('android.widget.EditText').nth(0|1)`. iOS **does** expose
  accessibility ids → `getById('Username'|'Password'|'Login'|'View All')` (recorded via codegen).
- **Fresh state is config-driven** (`resetBetweenTests` + `buildPath`); no `beforeEach`.
- Android `buildPath: '../app/DemoApp-v1.0.0.apk'` (committed); iOS `'../app/DemoApp-v1.0.0.app'`
  (NOT committed — macOS-only).

## Conventions

- Keep the two projects parallel in shape; only `platform`/`device`/`buildPath`/`appBundleId`/`testDir` differ.
- Don't delete the `ios` project just because it can't run here — it's the point of the lab (multi-target).

## Commands

```bash
nvm use 24 && npm install
npm run test:android        # --project android (runs anywhere)
npm run test:ios            # --project ios (macOS + simulator)
npx taqwright test --list   # tests grouped by [project]
```
