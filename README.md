# taqwright — a hands-on tutorial 🎭

Meet **[taqwright](https://github.com/taqelah/taqwright)** — the **Playwright test runner with a
flat `mobile` locator API on top of Appium 3**. Familiar drivers underneath, but a
**Playwright-style developer experience**: auto-waiting locators, auto-retrying assertions,
recording, cloud, and AI-generated tests.

This repo is self-contained: a slide deck, **12 hands-on labs**, and the demo-app binaries they run
against. Clone it and go.

> **The app under test:** [`taqelah/demo-app`](https://github.com/taqelah/demo-app/releases/tag/v1.0.0)
> (v1.0.0), committed under [`app/`](app/). Credentials: `emma@demoapp.com` / `10203040`.
> Appium 3.x / UiAutomator2.

> **TypeScript-only.** Every lab is a single TS project — `tests/*.spec.ts` +
> `taqwright.config.ts`. No dual-stack, no per-lab downloads.

## How it works — it overrides Playwright with Appium

taqwright is **not a fork** of Playwright. It **reuses Playwright Test's runner** (`@playwright/test`)
— `test`, fixtures, reporters, config, `expect` — and only **swaps the automation backend**: where
Playwright's `page` drives a browser over CDP/Chromium, taqwright's **`mobile`** fixture drives a
device over the **WebDriver protocol → Appium 3 → UiAutomator2 / XCUITest**. Escape hatch:
`mobile.raw` is the underlying WebDriver client.

![taqwright architecture — Playwright runner kept, Appium backend swapped in](images/architecture.svg)

## Quick start

```bash
nvm use 24                          # taqwright needs Node 24+
cd tutorial_01_setup_lab && npm install
npx taqwright doctor                # verify env
npx taqwright devices               # copy your AVD id into taqwright.config.ts
npx taqwright test                  # run (Appium auto-starts)
npx taqwright show-report           # open the HTML report
```

> The demo-app binaries are **committed under [`app/`](app/)** and every lab's `buildPath` already
> points at them — nothing to download. To install the APK by hand:
> `adb install -r app/DemoApp-v1.0.0.apk`

Green? Work through the labs below in roughly that order.

## The labs

| Lab | Topic |
|---|---|
| [`tutorial_01_setup_lab/`](tutorial_01_setup_lab/) ✅ | Install, provision & verify the toolchain, then a smoke run to the login screen |
| [`tutorial_02_codegen_lab/`](tutorial_02_codegen_lab/) 🚧 | Record a flow, rank locators, emit a spec — **ships with no spec; you record it into `tests/`** |
| [`tutorial_03_config_lab/`](tutorial_03_config_lab/) | §6 Configuration — six focused mini-projects, one per concept |
| [`tutorial_04_annotations_lab/`](tutorial_04_annotations_lab/) | §7 Annotations — tags, metadata, `skip`/`fixme`/`fail`/`slow` |
| [`tutorial_05_global_setup_lab/`](tutorial_05_global_setup_lab/) | §8 Global setup & teardown — a `globalSetup` module + a device setup project |
| [`tutorial_06_parallel_lab/`](tutorial_06_parallel_lab/) | §9 Parallelism — workers, device pool, `autoDiscover` (the pinned projects need **your** AVD names) |
| [`tutorial_07_parameterize_lab/`](tutorial_07_parameterize_lab/) | §10 Parameterize — one test per data row, inline + external JSON |
| [`tutorial_08_projects_lab/`](tutorial_08_projects_lab/) | §14 Projects — an Android and an iOS device target, each with its own spec |
| [`tutorial_09_merge_report_lab/`](tutorial_09_merge_report_lab/) | §15 Reporters — shard with the blob reporter, then `merge-reports` into one HTML |
| [`tutorial_10_retry_timeout_trace_lab/`](tutorial_10_retry_timeout_trace_lab/) | §17–19 Retries (flaky flagging), timeouts, and the trace viewer |
| [`tutorial_11_page_object_lab/`](tutorial_11_page_object_lab/) | Page Object pattern — one spec on both Android & iOS, one page object per screen (base + `Android*`/`Ios*` subclasses) |
| [`tutorial_12_cloud_debug_lab/`](tutorial_12_cloud_debug_lab/) | Run **lab 11's page objects + spec, verbatim** locally **and** on BrowserStack — only `device.provider` changes |

✅ start here · 🚧 scaffold — README + config stub ready, the spec is yours to capture

Each lab folder has its own `README.md` with the full walkthrough.

### ⚠️ Three things that are *this machine's*, not yours

The labs are committed with real values from the author's setup. Three of them won't resolve on
your machine — swap them before running:

| Where | What to change |
|---|---|
| [`tutorial_06_parallel_lab/taqwright.config.ts`](tutorial_06_parallel_lab/taqwright.config.ts) | The AVD names + serials (`Pixel_10_Pro_XL`, `emulator-5554`, …) in the `android-single` / `android-pool-2` projects. Get yours from `npx taqwright devices`, or just run the `android-auto-*` projects — they use `autoDiscover` and need no edits. |
| [`tutorial_12_cloud_debug_lab/taqwright.config.ts`](tutorial_12_cloud_debug_lab/taqwright.config.ts) | The `bs://…` app ids — a BrowserStack app id is **private to the account that uploaded it**. Upload [`app/`](app/)'s binaries to your account and set `TAQ_APK` / `TAQ_IPA` in `.env`, or point them at the local files to upload per run. |
| [`tutorial_02_codegen_lab/`](tutorial_02_codegen_lab/) | Nothing to change — but note there's **no spec to run**. Record the add-to-cart flow with `npx taqwright codegen` and save it into `tests/` first. |

> **Labs 11 and 12 share code.** `pages/` and `tests/add-to-cart.spec.ts` are byte-identical copies
> (labs are standalone npm projects, so nothing is imported across them) — the sole exception is
> `pages/index.ts`, where lab 12's factories match `projectName.includes('ios')` to catch its
> `browserstack-ios` project. Change a page object in one, mirror it in the other.

`tutorial_03_config_lab/` breaks §6 into six runnable mini-projects:
[`1_tests_and_timing/`](tutorial_03_config_lab/1_tests_and_timing/) ·
[`2_execution_and_output/`](tutorial_03_config_lab/2_execution_and_output/) ·
[`3_use_app_and_session/`](tutorial_03_config_lab/3_use_app_and_session/) ·
[`4_artifacts/`](tutorial_03_config_lab/4_artifacts/) ·
[`5_device_providers/`](tutorial_03_config_lab/5_device_providers/) ·
[`6_appium_server/`](tutorial_03_config_lab/6_appium_server/)

## Two engines

| | **A — author / record / run (local)** | **B — AI-generate (`lime-cli`)** |
|---|---|---|
| You provide | locators + actions, or a recording | a plain-English **goal** |
| Drives the device | you, locally | the **LIME server** agent |
| Account needed | none | **LIME Pro** + token + agent |
| Output | `*.spec.ts` (run with `npx taqwright test`) | `*.spec.ts` (same — run locally) |

Both produce the **same artifact**: a spec that `import`s from `taqwright`. Every lab here is
Engine A, except the debug half of `tutorial_12_cloud_debug_lab/`; Engine B needs a **LIME Pro account +
`LIME_CI_TOKEN` + lime-agent**, so it's demo-only.

## Prerequisites

```bash
node -v            # ⚠️ v24+  — taqwright requires Node 24
appium -v          # 3.x
adb devices        # emulator shows "device"
```

> **Bump Node first.** taqwright needs **Node 24+**:
> ```bash
> nvm install 24 && nvm use 24
> nvm alias default 24      # keeps npx (and the Appium MCP) working in new shells
> ```
> taqwright **auto-starts Appium** on `:4723`, so you don't have to run it in a separate terminal.

For `tutorial_12_cloud_debug_lab/` you'll also want a [BrowserStack](https://www.browserstack.com/) account —
plus your **own** app upload (see the table above); the `bs://…` ids in that config are the author's.
The `taqwright` skill is the authoritative reference for the `mobile` API, locator priority,
config, and `lime-cli`.

## CI quality gate

[`.github/workflows/quality-gate.yml`](.github/workflows/quality-gate.yml) runs on every PR:
it typechecks `tutorial_11_page_object_lab/`, then runs that lab's `add-to-cart.spec.ts` on a
real **Android emulator** (API 34, x86_64) on the GitHub runner — same command you run locally,
`npm run test:android`. Appium 3 + the uiautomator2 driver are installed from npm, the emulator
comes from [`reactivecircus/android-emulator-runner`](https://github.com/ReactiveCircus/android-emulator-runner),
and the app under test is the committed [`app/DemoApp-v1.0.0.apk`](app/). On failure the HTML
report and traces are uploaded as a build artifact.

iOS isn't gated — that needs a `macos` runner and a booted simulator.

## The slide deck

The deck walks the **entire taqwright docs sidebar, top to bottom** — Part 1 *Getting started*
(Installation · Codegen · Writing tests · Generating tests · Running & debugging) and Part 2
*Taqwright Test* (Configuration · Annotations · Command line · Global setup & teardown ·
Parallelism · Parameterize · Projects · Reporters · Retries · Sharding · Timeouts · Actions ·
Assertions · Auto-waiting · Trace viewer). The labs are the hands-on slice of it.

It's [Marp](https://marp.app) Markdown ([`slides.md`](slides.md)), with `slides.html` and
`slides.pdf` built alongside.

```bash
# Live preview with hot-reload
npx @marp-team/marp-cli@latest -p -w slides.md

# Export
npx @marp-team/marp-cli@latest slides.md -o slides.html
npx @marp-team/marp-cli@latest slides.md --pdf
```

> Edit `slides.md`, then rebuild `slides.html` — that's the source of truth for the deck.

---

Brought to you by [Taqelah](https://taqelah.sg) 🚀
