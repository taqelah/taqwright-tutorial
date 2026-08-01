# CLAUDE.md — merge report lab

> Claude Code loads this file at the start of every session. Keep it short and current.

## What this is

A mini-project for **§15 · Reporters** — the **blob → `merge-reports`** flow. Two spec files run
against `taqelah/demo-app`; sharding them with `--reporter blob` produces per-shard archives, and
`taqwright merge-reports blob-report --reporter html` stitches them into one HTML report. taqwright =
Playwright runner + flat `mobile` API on Appium 3.x.

- **TypeScript only**; specs in `tests/`.
- Use the **`taqwright` skill** for the authoritative `mobile` API, locator priority, config shape.

## Key facts

- App package `com.taqelah.demo_app`; login `emma@demoapp.com` / `10203040`.
- Button `getByLabel('Login')`; home marker `getByLabel('View All')`; fields
  `getByType('android.widget.EditText').nth(0|1)` (Flutter EditTexts, no id).
- **Fresh state is config-driven** (`resetBetweenTests` + `buildPath`); no `beforeEach`.

## Conventions / gotchas

- **`blob` is a CLI flag** (`--reporter blob`), NOT in `taqwright.config.ts` — keep the config's
  reporter human-readable (list + html).
- Keep **two spec files** so `--shard 1/2` and `2/2` each get work (file-level split).
- ⚠️ The blob reporter **clears `blob-report/` at the start of each run**, so two local shards would
  clobber. Each `shardN` script `mv`s its blob into **`all-blobs/`**; `merge` reads `all-blobs/`.
  (In CI each shard is a separate machine → no clobber → just gather artifacts and merge.)

## Commands

```bash
nvm use 24 && npm install
npm run clean                        # reset blob-report/ all-blobs/ playwright-report/
npm run shard1 && npm run shard2     # two blobs → all-blobs/
npm run merge                        # merge-reports all-blobs --reporter html
npm run report                       # show-report (one combined report)
```
