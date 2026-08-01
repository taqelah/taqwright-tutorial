# CLAUDE.md — config lab (container)

> Claude Code loads this file at the start of every session. Keep it short and current.

## What this is

A **container** of 6 independent mini-projects, one per §6 Configuration concept. Each sub-folder
(`1-tests-and-timing/` … `6-appium-server/`) is a full, runnable taqwright project that runs the
**same** login spec against `taqelah/demo-app` (Flutter, Android) on a local emulator. The point
is the differences between their `taqwright.config.ts` files.

- **No root project here** — there's no `package.json`/`node_modules` at `config-lab/` itself.
  Work inside a sub-folder (`cd 4-artifacts && npm install && npm test`).
- **TypeScript only**, taqwright = Playwright runner + flat `mobile` API on Appium 3.x.
- Use the **`taqwright` skill** for the authoritative `mobile` API, locator priority, and config shape.

## Conventions (every sub-folder)

- The shared spec is `tests/login.spec.ts` — login fields are Flutter `EditText`s with no label →
  `getByType('android.widget.EditText').nth(0|1)`; button/marker use `getByLabel('Login'|'View All')`.
- **Fresh state is config-driven**: `resetBetweenTests: true` + `buildPath: '../../app/DemoApp-v1.0.0.apk'`
  + `appBundleId` reinstall the app before each test. No `beforeEach`.
- Each config keeps a **runnable android/emulator baseline** and only *spotlights* its concept's keys
  (heavily commented). Keep them runnable — if you change a config, it must still pass.
- App facts: package `com.taqelah.demo_app`; login `emma@demoapp.com` / `10203040`; splash before login
  (auto-waiting handles it — never `waitForTimeout`).

## Commands

```bash
cd <n>-<concept>           # e.g. 2-execution-and-output
nvm use 24 && npm install
npm test                   # npx taqwright test
npx taqwright show-report
```
