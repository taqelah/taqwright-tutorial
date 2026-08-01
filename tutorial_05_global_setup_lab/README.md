# Global Setup & Teardown Lab 🌐

A focused mini-project for **§8 · Global setup & teardown**. It shows the **two** ways taqwright
runs code "around" your tests, and the order they fire in.

This lab is **complete and runnable**.

```text
tutorial_05_global_setup_lab/
├── taqwright.config.ts     wires BOTH mechanisms (globalSetup module + setup project)
├── global-setup.ts         (1) no-device module — runs once before everything
├── global-teardown.ts      (1) no-device module — runs once after everything
└── tests/
    ├── global.setup.ts     (2) setup PROJECT — device access, runs first (test as setup)
    ├── login.spec.ts       the 'android' tests — depend on 'setup', run after
    └── hooks.spec.ts       (3) spec-level hooks — beforeAll/afterAll · beforeEach/afterEach
```

## The mechanisms — global vs file vs per-test

| Mechanism | Device? | When | Use for |
| --- | --- | --- | --- |
| **`globalSetup` / `globalTeardown` module** | ❌ no | once per **run** | seed a DB, fetch a token, write a fixture |
| **Setup project** (`dependencies: ['setup']`) | ✅ yes | once, **before dependents** | sign in, grant permissions, dismiss dialogs |
| **`beforeAll` / `afterAll`** | ✅ yes | once per **file** (or `describe`) | per-file prep — open a screen once |
| **`beforeEach` / `afterEach`** | ✅ yes | **every test** | reset state, navigate to a start point |

> ⚠️ The module runs in the **main process**, so values it puts on `process.env` do **not** reach
> the (separate) test workers — pass data via a written file / storage state. Here the module just
> logs, so you can *see* it ran.

## Run

```bash
cd tutorial_05_global_setup_lab
nvm use 24
npm install
npm test
npx taqwright show-report
```

Watch the order in the output:

```
[globalSetup] …              ← module, no device, once per run
  setup › sign in once       ← setup project, on device, runs first
  android › hooks.spec.ts:
    [beforeAll]              ← once per file
      [beforeEach] → test → [afterEach]   ← per test
      [beforeEach] → test → [afterEach]
    [afterAll]
  android › login.spec.ts › a valid user can log in
[globalTeardown] …           ← module, no device, once per run
```

`npx taqwright test --list` shows both projects; `--project android` still pulls in `setup` first
(because of the dependency).

## Things to try

- Make `tests/global.setup.ts` fail → the dependent `android` tests are **skipped** (a failed
  dependency blocks its dependents).
- Add real work to `global-setup.ts` (e.g. write a `./fixtures/token.txt`) and read it from a test.

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `taqwright: command not found` / wrong Node | `nvm use 24`, then `npm install`. |
| `Unable to find an active device` | Boot an emulator; `npx taqwright devices`, or set `device.udid`. |
| `android` tests didn't run | The `setup` project failed — check its output; dependents skip on a failed dependency. |
| APK not found at `buildPath` | Ensure [`../app/DemoApp-v1.0.0.apk`](../app/) exists (committed). |
| `ECONNREFUSED 127.0.0.1:4723` | Appium didn't auto-start — confirm `appium.autoStart`, or run `appium`. |
