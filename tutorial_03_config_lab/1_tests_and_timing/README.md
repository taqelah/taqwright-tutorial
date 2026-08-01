# tutorial_03_config_lab · tests & timing ⚙️

A focused mini-project for one §6 Configuration concept: **Configuration — top-level · tests & timing**.
It runs the shared login spec; the only thing special here is **`taqwright.config.ts`** — read it.

**Spotlights:** `testDir` · `testMatch` · `testIgnore` · `timeout` · `expectTimeout` · `retries`

## Run

```bash
cd tutorial_03_config_lab/1_tests_and_timing
nvm use 24          # taqwright needs Node 24+
npm install
npm test            # = npx taqwright test  (Appium auto-starts; APK reinstalled from ../../app/)
npx taqwright show-report
```

## Look at

- Change `timeout` to `5_000` and watch a slow step blow the per-test budget.
- Bump `expectTimeout` down and see assertions give up sooner (polled every 200 ms).
- Break a locator with `retries: 1` → taqwright reruns from scratch and marks it **flaky**.
- Edit `testMatch`/`testIgnore` to include/exclude specs.

Prereqs: a booted Android emulator + the shared APK at [`../../app/DemoApp-v1.0.0.apk`](../../app/)
(already in the repo — `buildPath` points there). Stuck? See the parent
[`tutorial_03_config_lab/README.md`](../README.md) troubleshooting.
