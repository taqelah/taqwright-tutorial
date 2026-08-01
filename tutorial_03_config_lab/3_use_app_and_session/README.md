# tutorial_03_config_lab · use · app & session ⚙️

A focused mini-project for one §6 Configuration concept: **Configuration — the `use` block · app & session**.
It runs the shared login spec; the only thing special here is **`taqwright.config.ts`** — read it.

**Spotlights:** `platform` · `appBundleId` · `buildPath` · `resetBetweenTests` · `capabilities` · per-project `expectTimeout`

## Run

```bash
cd tutorial_03_config_lab/3_use_app_and_session
nvm use 24          # taqwright needs Node 24+
npm install
npm test            # = npx taqwright test  (Appium auto-starts; APK reinstalled from ../../app/)
npx taqwright show-report
```

## Look at

- The `resetBetweenTests` **trio** (`+ buildPath + appBundleId`) reinstalls the app before each test — delete one and TypeScript complains.
- `capabilities: { 'appium:autoGrantPermissions': true }` is forwarded raw to Appium.
- `expectTimeout` here overrides the global one for this project only.

Prereqs: a booted Android emulator + the shared APK at [`../../app/DemoApp-v1.0.0.apk`](../../app/)
(already in the repo — `buildPath` points there). Stuck? See the parent
[`tutorial_03_config_lab/README.md`](../README.md) troubleshooting.
