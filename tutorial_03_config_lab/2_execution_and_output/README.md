# tutorial_03_config_lab · execution & output ⚙️

A focused mini-project for one §6 Configuration concept: **Configuration — top-level · execution & output**.
It runs the shared login spec; the only thing special here is **`taqwright.config.ts`** — read it.

**Spotlights:** `workers` · `fullyParallel` · `reporter` · `outputDir` · `globalSetup`/`globalTeardown` · `forbidOnly`

## Run

```bash
cd tutorial_03_config_lab/2_execution_and_output
nvm use 24          # taqwright needs Node 24+
npm install
npm test            # = npx taqwright test  (Appium auto-starts; APK reinstalled from ../../app/)
npx taqwright show-report
```

## Look at

- The console prints `[global-setup]` once before tests and `[global-teardown]` once after.
- After the run, find **`report.json`** (extra reporter) and the HTML report; artifacts go to `./artifacts`.
- Set `workers: 2` (needs 2 emulators) → the two tests fan out across devices.
- Add `test.only(...)` to a spec → `forbidOnly: true` fails the run (CI guard).

Prereqs: a booted Android emulator + the shared APK at [`../../app/DemoApp-v1.0.0.apk`](../../app/)
(already in the repo — `buildPath` points there). Stuck? See the parent
[`tutorial_03_config_lab/README.md`](../README.md) troubleshooting.
