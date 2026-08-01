# Annotations Lab — tags, metadata & test modifiers 🏷️

A focused mini-project for **§7 · Annotations**. It runs the demo-app login flow, but the point is
the **annotations** in [`tests/annotations.spec.ts`](tests/annotations.spec.ts) — the modifiers and
metadata taqwright inherits from the Playwright runner.

This lab is **complete and runnable**.

## Run

```bash
cd tutorial_04_annotations_lab
nvm use 24                          # taqwright needs Node 24+
npm install

npx taqwright test --list           # see how each test is reported (tagged / skipped / fixme / …)
npx taqwright test --grep @smoke    # run ONLY @smoke-tagged tests
npx taqwright test --grep-invert @checkout   # everything EXCEPT @checkout
npm test                            # run the suite
npx taqwright show-report           # custom metadata + trace show up here
```

## What the spec demonstrates

| Annotation | Effect |
| --- | --- |
| `{ tag: '@smoke' }` / `['@smoke','@checkout']` | filter with `--grep` / `--grep-invert` |
| `{ annotation: { type, description } }` | freeform **metadata** → shows in the HTML report; no effect on execution |
| `test.skip('…')` | never runs (feature not built) |
| `test.skip(isCI, 'reason')` | **conditional** skip (here: when `CI` is set) |
| `test.fixme('…')` | known-broken — won't run, won't fail the suite |
| `test.fail('…')` | **expected failure** — the suite passes *because* it fails |
| `test.slow()` | triples this test's timeout |

> Prereqs: a booted Android emulator + the shared APK at
> [`../app/DemoApp-v1.0.0.apk`](../app/) (already in the repo — `buildPath` points there).
> Fresh state per test is config-driven (`resetBetweenTests` + `buildPath`), so the spec needs no
> `beforeEach`.

## Things to try

- `CI=1 npx taqwright test` → the conditional `test.skip(isCI, …)` now skips.
- Remove `test.fail` from the wrong-password test → it now **fails** the run (that's the point of `fail`).
- Add a `@regression` tag to a test and run `--grep @regression`.

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `taqwright: command not found` / wrong Node | `nvm use 24`, then `npm install`. |
| `Unable to find an active device` | Boot an emulator; `npx taqwright devices`, or set `device.udid`. |
| APK not found at `buildPath` | Ensure [`../app/DemoApp-v1.0.0.apk`](../app/) exists (committed). |
| `ECONNREFUSED 127.0.0.1:4723` | Appium didn't auto-start — confirm `appium.autoStart`, or run `appium`. |
