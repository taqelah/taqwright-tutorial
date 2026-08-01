# Config Lab — 6 mini-projects, one per §6 concept ⚙️

The **configuration** lab. Instead of one big config with toggles, each §6 Configuration concept
gets its **own self-contained mini-project**. They all run the *same* login spec on a local
emulator — the only thing that changes between folders is **`taqwright.config.ts`**. That file is
the lesson: open it, run it, see that one dimension in isolation.

| Mini-project | Spotlights | §6 slide |
| --- | --- | --- |
| [`1-tests-and-timing/`](1-tests-and-timing/) | `testDir` · `timeout` · `expectTimeout` · `retries` | top-level · tests & timing |
| [`2-execution-and-output/`](2-execution-and-output/) | `workers` · `reporter` · `globalSetup` · `forbidOnly` | top-level · execution & output |
| [`3-use-app-and-session/`](3-use-app-and-session/) | `platform` · `buildPath` · `resetBetweenTests` · `capabilities` | the `use` block · app & session |
| [`4-artifacts/`](4-artifacts/) | `trace` · `video` · `network` (+ modes) | `use` artifacts |
| [`5-device-providers/`](5-device-providers/) | `emulator` · `udid` · `pool` · cloud | `device` providers |
| [`6-appium-server/`](6-appium-server/) | `autoStart` · `host`/`port`/`path` · timeouts | the `appium` server |

## How to use

Each folder is independent — install and run whichever concept you're on:

```bash
cd config-lab/4-artifacts   # pick a concept
nvm use 24                            # taqwright needs Node 24+
npm install
npm test                              # runs the shared login spec under that folder's config
npx taqwright show-report
```

Then **edit that folder's `taqwright.config.ts`** and re-run to feel each key (each README lists
"things to try").

## Prerequisites (all folders)

- **Node 24+**, a booted Android emulator (`adb devices`).
- The shared APK is already committed at [`../app/DemoApp-v1.0.0.apk`](../app/); every config's
  `buildPath` points at it (`../../app/…` from inside a sub-folder) — nothing to download.

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `taqwright: command not found` / wrong Node | `nvm use 24`, then `npm install` in the folder. |
| `Unable to find an active device` | Boot an emulator; `npx taqwright devices`, or set `device.udid`. |
| APK not found at `buildPath` | Ensure [`../app/DemoApp-v1.0.0.apk`](../app/) exists (committed). |
| `ECONNREFUSED 127.0.0.1:4723` | Appium didn't auto-start — confirm `appium.autoStart`, or run `appium`. |
