# tutorial_03_config_lab · device providers ⚙️

A focused mini-project for one §6 Configuration concept: **Configuration — `device` providers**.
It runs the shared login spec; the only thing special here is **`taqwright.config.ts`** — read it.

**Spotlights:** `emulator` · `local-device` · `browserstack` · `lambdatest` — `udid` · `pool` · `autoDiscover`

## Run

```bash
cd tutorial_03_config_lab/5_device_providers
nvm use 24          # taqwright needs Node 24+
npm install
npm test            # = npx taqwright test  (Appium auto-starts; APK reinstalled from ../../app/)
npx taqwright show-report
```

## Look at

- Default `autoDiscover: true` boots whatever emulator is around — no name needed.
- Swap to `udid: 'emulator-5554'` (from `npx taqwright devices`) to pin one device.
- Uncomment the `browserstack` project + export creds → `npx taqwright test --project browserstack`.
- Precedence when several are set: **udid › pool › name › autoDiscover**.

Prereqs: a booted Android emulator + the shared APK at [`../../app/DemoApp-v1.0.0.apk`](../../app/)
(already in the repo — `buildPath` points there). Stuck? See the parent
[`tutorial_03_config_lab/README.md`](../README.md) troubleshooting.
