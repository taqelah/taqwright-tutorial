# Projects Lab — one config, many targets 🧩

A focused mini-project for **§14 · Projects**. A *project* is a named group of tests with one `use`
(platform · device · build · artifacts). This lab has **two**: an `android` target and an `ios`
target, each running its **own** login spec.

This lab is **complete and runnable** (the `android` project; `ios` is macOS-only — see below).

```text
projects-lab/
├── taqwright.config.ts     two projects: android + ios
└── tests/
    ├── android/login.spec.ts   runs under --project android
    └── ios/login.spec.ts       runs under --project ios
```

## The two projects

| Project | Platform | Run | Runs where |
| --- | --- | --- | --- |
| **`android`** | `Platform.ANDROID` | `npx taqwright test --project android` | **anywhere** (emulator + shared APK) |
| `ios` | `Platform.IOS` | `npx taqwright test --project ios` | macOS + iPhone simulator + a `.app` build |

```bash
cd projects-lab
nvm use 24
npm install

npm run test:android                       # just the android project
npm run test:ios                           # just the ios project (macOS)
npx taqwright test --project android --project ios   # both (repeatable flag)
npx taqwright test                         # all projects
npx taqwright test --list                  # see tests grouped by [project]
```

`--list` shows each test prefixed by its project (`[android]` / `[ios]`) — that's the whole idea:
**one config, the same flow across targets.**

## How it works

- Each project sets its own **`testDir`** (`./tests/android` vs `./tests/ios`) and **`use`**
  (platform, device, `buildPath`, `appBundleId`). Android uses `com.taqelah.demo_app`; iOS uses the
  camelCase **`com.taqelah.demoApp`**.
- Fresh state per test is config-driven (`resetBetweenTests` + `buildPath`) — no `beforeEach`.
- **Also** (other `projects[]` fields, from the slide): `dependencies` — make a project run **after**
  another (e.g. a setup project); a project is **skipped** if a dependency fails. `testMatch` /
  `testIgnore` — narrow which files a project picks up. Same idea scales to a **BrowserStack** project.

> ⚠️ iOS isn't runnable here out-of-the-box: it needs **macOS**, a booted **iPhone simulator**, and a
> simulator **`.app` build** at `../app/DemoApp-v1.0.0.app` (not committed). The `ios` project still
> loads in `--list`; Android runs fully.

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `taqwright: command not found` / wrong Node | `nvm use 24`, then `npm install`. |
| `Unable to find an active device` (android) | Boot an emulator; `npx taqwright devices`, or set `device.udid`. |
| APK not found at `buildPath` | Ensure [`../app/DemoApp-v1.0.0.apk`](../app/) exists (committed). |
| iOS project fails to run | macOS-only; needs a simulator + `../app/DemoApp-v1.0.0.app` (not committed). Use `--project android`. |
