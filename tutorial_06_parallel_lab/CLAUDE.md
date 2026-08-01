# CLAUDE.md — parallel lab

> Claude Code loads this file at the start of every session. Keep it short and current.

## What this is

A §9 Parallelism mini-project adapted from the official
[taqwright-demo](https://github.com/Taqwright/taqwright-demo) config: **4 local-Android projects**,
each a parallelism strategy (pinned `udid` · `pool` · `autoDiscover` 1-/2-wide) against
`taqelah/demo-app`. The `taqwright.config.ts` IS the lesson; run one strategy with
`npx taqwright test --project <name>`. (The demo's cloud/iOS projects are omitted here.)

- **TypeScript only**; android specs in `tests/android/` (per-project `testDir`).
- Use the **`taqwright` skill** for the authoritative `mobile` API, locator priority, config shape.

## Key facts

- App package `com.taqelah.demo_app`.
- Login `emma@demoapp.com` / `10203040`; login button `getByLabel('Login')`; home `getByLabel('View All')`.
- Android login fields = Flutter `EditText`s → `getByType('android.widget.EditText').nth(0|1)`.
- **Fresh state is config-driven** (`resetBetweenTests` + `buildPath`); no `beforeEach`.

## Parallelism rules (don't break these)

- **Per-project `workers`** (effective = project.workers ?? config.workers ?? 1); must be
  **≤ the project's device count** (pool length / discovered AVDs).
- `appium.autoStart` → worker *i* spawns Appium on **`4723 + i`** (automatic). `autoStartDevice`
  cold-boots named AVDs up front.
- The only change from the upstream demo config is `buildPath` → the repo's shared
  `../app/DemoApp-v1.0.0.apk` (with `process.env.TAQ_APK` override kept).

## Commands

```bash
nvm use 24 && npm install
npm run test:auto1     # serial baseline (1 device)
npm run test:auto2     # 2-wide (needs 2 booted AVDs)
npx taqwright show-report
```
