# Setup Lab — get your machine ready 🧰

The **one-time environment setup** before any taqwright test: install the runner, provision (or
point at) the Android toolchain, and prove it all works with a **green `doctor` + a smoke run**.
When this lab is green you're ready for the per-topic labs (e.g.
[`../tutorial_03_config_lab/`](../tutorial_03_config_lab/), [`../tutorial_04_annotations_lab/`](../tutorial_04_annotations_lab/)).

This lab is **complete and runnable**.

```text
tutorial_01_setup_lab/
├── taqwright.config.ts     one android/emulator project, appBundleId, trace on-failure
├── tests/
│   └── smoke.spec.ts       launch the demo-app → assert the login screen renders
├── package.json            taqwright + typescript; `npm test` → taqwright test
└── tsconfig.json
```

## 0 · Prerequisites 🧰

**Node 24+ is the one hard requirement** — `taqwright doctor` *errors* below it; every other
check is a soft warning. If your default is older, bump first:

```bash
nvm install 24 && nvm use 24
nvm alias default 24      # keeps `npx` (and the Appium MCP) working in new shells
node -v                   # v24.x
```

## 1 · Install taqwright 📦

```bash
cd tutorial_01_setup_lab
npm install
```

> 📦 The package is **`@taqwright/taqwright`**. This lab's `package.json` aliases it to
> `taqwright` (`"taqwright": "npm:@taqwright/taqwright@..."`) so the docs' `import … from
> 'taqwright'` and `npx taqwright` both work verbatim. Starting from scratch instead?
> `npm init taqwright` (scaffold) or `npm i -D @taqwright/taqwright@beta` (add to a project).

## 2 · Provision the toolchain ⚙️

`taqwright install` does **zero-touch setup on a fresh machine** — JDK + Android SDK + Appium
(and the drivers):

```bash
npx taqwright install              # JDK + Android SDK + Appium — zero-touch
npx taqwright install --with-avd   # …also build a system image + emulator (~1 GB)
npx taqwright install --print-env  # print export lines to use the toolchain from your shell
```

> ⚠️ **Android only** — iOS needs **Xcode** (manual).
> 💡 **Already have your own SDK + emulator? Skip `install`.** It sets up a *separate,
> taqwright-managed* toolchain that **won't see or drive an SDK/emulator you already have** —
> handy for a brand-new laptop, but if you're already set up just jump to step 3 and point
> `device.name` at your existing AVD.

## 3 · Verify the machine 🩺

A pre-flight check of the whole mobile toolchain before you run a test:

```bash
npx taqwright doctor        # 13 checks across Android + iOS
```

You only need the rows for **your** platform. **Node 24 is the only hard fail** — everything
else is a soft warn. Add `--json` for CI / agents. Run it first whenever something's off.

## 4 · Get the app 📱

Nothing to download — the APK is **committed in this repo** at
[`../app/DemoApp-v1.0.0.apk`](../app/) and the config already points `buildPath` there.
Because it sets `resetBetweenTests: true` + `buildPath`, taqwright **reinstalls the APK and
relaunches the app before every test** for a guaranteed-clean state (no manual `adb install`).

- Package: `com.taqelah.demo_app`
- Login: `emma@demoapp.com` / `10203040`

## 5 · Pick a target 🎯

```bash
npx taqwright devices       # lists your AVDs / simulators / connected devices
```

This lab's config sets `device.autoDiscover: true`, so taqwright **enumerates and boots an
available emulator for you** — no need to edit anything as long as `devices` shows one. Want to
pin a specific AVD instead? Comment `autoDiscover` and set `device.name` (the `avd:<id>` from
above; a regex also works) in [`taqwright.config.ts`](taqwright.config.ts).

## 6 · Smoke test 🚀

Prove the whole chain — install → device → Appium → app launch — works end to end:

```bash
npm test                    # = npx taqwright test (Appium auto-starts on :4723)
npx taqwright show-report   # open the HTML report — trace timeline on any failure
```

[`tests/smoke.spec.ts`](tests/smoke.spec.ts) just launches the demo-app and asserts its **login
screen** rendered (`getByLabel('Login')`). It does **not** log in — that's the basics lab.
Fresh state is handled by the config (`resetBetweenTests` + `buildPath` reinstall the APK before
each test), so the spec itself needs no `beforeEach`.

## Next → 🎭

Environment green? Work through the per-topic labs — e.g. [`../tutorial_03_config_lab/`](../tutorial_03_config_lab/)
(tune the run), [`../tutorial_04_annotations_lab/`](../tutorial_04_annotations_lab/), [`../tutorial_07_parameterize_lab/`](../tutorial_07_parameterize_lab/),
[`../tutorial_06_parallel_lab/`](../tutorial_06_parallel_lab/).

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `taqwright: command not found` / wrong Node | `nvm use 24` (taqwright needs Node 24+), then `npm install`. |
| `npx` not found in a new terminal | nvm has no default — `nvm alias default 24`, reopen the shell. |
| `doctor` errors on the Node row | You're below v24 — that's the one hard fail; bump Node and re-run. |
| `Unable to find an active device` | Emulator not booted, or `device.name` doesn't match — check `npx taqwright devices` and update `taqwright.config.ts`. |
| Smoke test lands on Home, not Login | App stayed logged in — `adb shell pm clear com.taqelah.demo_app` once, then re-run. |
| `ECONNREFUSED 127.0.0.1:4723` | Appium didn't auto-start — confirm `appium.autoStart` is true, or run `appium` yourself. |
| Wrong app behavior / missing elements | Install the correct build — `adb install -r DemoApp-v1.0.0.apk`. |
