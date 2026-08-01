# Retry · Timeout · Trace Lab 🔁⏱️🔎

One lab for the three "tail" topics — **§17 Retries**, **§18 Timeouts**, **§19 Trace viewer**. The
config turns on `retries: 2` and `trace: 'on'`; each spec exercises one topic.

This lab is **complete and runnable** (needs a booted Android emulator).

```text
retry-timeout-trace-lab/
├── taqwright.config.ts     retries: 2 · trace: 'on'
└── tests/
    ├── retries.spec.ts     §17 — flaky test that clears on retry
    ├── timeouts.spec.ts    §18 — test.setTimeout + per-assertion { timeout }
    └── trace.spec.ts       §19 — a plain login whose trace you open
```

## Run

```bash
cd retry-timeout-trace-lab
nvm use 24
npm install
npx taqwright test           # retries: 2 + trace: 'on'
npx taqwright show-report    # open a test → "taqwright-trace" → step the timeline
```

## §17 · Retries

`tests/retries.spec.ts` is **flaky by design**: it asserts `testInfo.retry > 0`, so it **fails the
first attempt** (`retry === 0`) and **passes on the retry**. With `retries: 2`, the runner reruns it
from a **fresh Appium session** and reports it as **flaky** (yellow), not failed.

- Set globally (`retries: 2`), per-run (`--retries 2`), or per-group (`test.describe.configure({ retries })`).
- `testInfo.retry` (0,1,2…) lets you capture extra diagnostics only on reruns.

## §18 · Timeouts

`tests/timeouts.spec.ts` shows both budgets:

| Budget | Default | Set with |
| --- | --- | --- |
| whole **test** (+ hooks/fixtures) | 60 s | `timeout` · `--timeout` · `test.setTimeout()` · `test.slow()` (3×) |
| **expect / action** | 30 s | `expectTimeout` · per-call `{ timeout }` |

## §19 · Trace viewer

`trace: 'on'` captures a trace for **every** test (incl. the flaky test's failed attempt). Open it:

```bash
npx taqwright show-report      # open a test → "taqwright-trace" attachment
# or directly: test-results/<test-name>/trace.html
```

A trace = a **clickable timeline** (failures highlighted) · a **screenshot after each action** ·
action name/args/errors · **page-source XML** snapshots. Modes: `off` · `on` · `on-failure` ·
`retain-on-failure` — `on` adds ~100–300 ms/action, so prefer **`on-failure`** in CI.

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| retries test shows **failed**, not flaky | It must pass *eventually* — keep `retries: 2`; the assertion clears on `retry > 0`. |
| `Unable to find an active device` | Boot an emulator; `npx taqwright devices`. |
| No trace in the report | Confirm `trace: 'on'` (or `'on-failure'` with a failing test); re-run, then `show-report`. |
| APK not found at `buildPath` | Ensure [`../app/DemoApp-v1.0.0.apk`](../app/) exists (committed). |
