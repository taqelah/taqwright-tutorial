# CLAUDE.md — retry · timeout · trace lab

> Claude Code loads this file at the start of every session. Keep it short and current.

## What this is

A combined lab for **§17 Retries · §18 Timeouts · §19 Trace viewer** against `taqelah/demo-app`.
The config sets `retries: 2` and `trace: 'on'`; each spec exercises one topic. taqwright =
Playwright runner + flat `mobile` API on Appium 3.x.

- **TypeScript only**; specs in `tests/`.
- Use the **`taqwright` skill** for the authoritative `mobile` API, locator priority, config shape.

## Key facts

- App package `com.taqelah.demo_app`; login `emma@demoapp.com` / `10203040`.
- Button `getByLabel('Login')`; home marker `getByLabel('View All')`; fields
  `getByType('android.widget.EditText').nth(0|1)`.
- **Fresh state is config-driven** (`resetBetweenTests` + `buildPath`); no `beforeEach`.

## Conventions / gotchas

- `tests/retries.spec.ts` is **flaky on purpose** — `expect(testInfo.retry).toBeGreaterThan(0)`
  makes it fail attempt 0 and pass on retry, so it reports **flaky**. Don't "fix" it.
- Keep `retries: 2` (so the flaky test recovers) and `trace: 'on'` (so the trace viewer has data).
- Timeouts: whole-test = `test.setTimeout()` / `test.slow()`; expect/action = `expectTimeout` or
  per-call `{ timeout }`. There is **no** separate action/navigation/global timeout.

## Commands

```bash
nvm use 24 && npm install
npx taqwright test            # see the retries test reported "flaky"
npx taqwright show-report     # open a test → "taqwright-trace" → step the timeline
```
