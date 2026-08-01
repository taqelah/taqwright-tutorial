# config-lab · appium server ⚙️

A focused mini-project for one §6 Configuration concept: **Configuration — the `appium` server**.
It runs the shared login spec; the only thing special here is **`taqwright.config.ts`** — read it.

**Spotlights:** `autoStart` · `autoStartDevice` · `host` · `port` · `path` · `newCommandTimeout` · `connectionTimeout` · `logLevel`

## Run

```bash
cd config-lab/6-appium-server
nvm use 24          # taqwright needs Node 24+
npm install
npm test            # = npx taqwright test  (Appium auto-starts; APK reinstalled from ../../app/)
npx taqwright show-report
```

## Look at

- `autoStart: true` spawns Appium for you on `:4723`; start `appium` yourself and it attaches instead.
- Set `logLevel: 'debug'` and re-run to see the Appium handshake.
- `autoStartDevice: true` cold-boots an offline emulator (give `device.name` a string).
- Change `port`/`path` to point at a remote or proxied Appium.

Prereqs: a booted Android emulator + the shared APK at [`../../app/DemoApp-v1.0.0.apk`](../../app/)
(already in the repo — `buildPath` points there). Stuck? See the parent
[`config-lab/README.md`](../README.md) troubleshooting.
