# tutorial_03_config_lab · artifacts · trace · video · network ⚙️

A focused mini-project for one §6 Configuration concept: **Configuration — `use` artifacts · trace · video · network**.
It runs the shared login spec; the only thing special here is **`taqwright.config.ts`** — read it.

**Spotlights:** `trace` · `video` · `network` (modes: `off` · `on` · `on-failure` · `retain-on-failure`)

## Run

```bash
cd tutorial_03_config_lab/4_artifacts
nvm use 24          # taqwright needs Node 24+
npm install
npm test            # = npx taqwright test  (Appium auto-starts; APK reinstalled from ../../app/)
npx taqwright show-report
```

## Look at

- `trace: 'on'` here records **every** test → `npx taqwright show-report` → click a test → step through screenshots + page source.
- Flip `video: 'on'` to get an `.mp4`; `network: 'on'` to capture a HAR.
- Switch all three to `on-failure` (the CI default) and re-run a passing suite → no artifacts kept.

Prereqs: a booted Android emulator + the shared APK at [`../../app/DemoApp-v1.0.0.apk`](../../app/)
(already in the repo — `buildPath` points there). Stuck? See the parent
[`tutorial_03_config_lab/README.md`](../README.md) troubleshooting.
