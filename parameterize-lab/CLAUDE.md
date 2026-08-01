# CLAUDE.md — parameterize lab

> Claude Code loads this file at the start of every session. Keep it short and current.

## What this is

A mini-project for **§10 · Parameterize tests**. It drives the `taqelah/demo-app` login flow from
**data** — one `test()` per row — both inline (`tests/parameterize.spec.ts`) and from an external
file (`tests/from-json.spec.ts` ← `data/accounts.json`). taqwright = Playwright runner + flat
`mobile` API on Appium 3.x.

- **TypeScript only**; `tests/*.spec.ts` import from `'taqwright'`.
- Use the **`taqwright` skill** for the authoritative `mobile` API, locator priority, config shape.

## App facts

- Package `com.taqelah.demo_app`; login `emma@demoapp.com` / `10203040`.
- Login button accessibility id **`Login`** → `getByLabel('Login')`; home marker **`View All`**.
- Login fields are Flutter `EditText`s with no id → `getByType('android.widget.EditText').nth(0|1)`.

## Conventions

- **Parameterize at collection time**: build `test()`s in a top-level `for (const row of data)` loop
  so `npx taqwright test --list` shows one test per row. Don't nest the loop inside a `test()`.
- Each row carries an `expectHome` flag → one parameterized test covers happy + failure paths.
- **Fresh state is config-driven** (`resetBetweenTests` + `buildPath`); no `beforeEach`.
- External data: read JSON via `readFileSync(new URL('../data/accounts.json', import.meta.url))`
  (the project is `type: "module"`), cast to the `Account[]` type.

## Commands

```bash
nvm use 24 && npm install
npx taqwright test --list      # one test per account
npm test
npx taqwright show-report
```
