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
cd setup-lab && npm install
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
| [`setup-lab/`](setup-lab/) ✅ | Install, provision & verify the toolchain, then a smoke run to the login screen |
| [`codegen-lab/`](codegen-lab/) 🚧 | Record a flow, rank locators, emit a spec |
| [`config-lab/`](config-lab/) | §6 Configuration — six focused mini-projects, one per concept |
| [`annotations-lab/`](annotations-lab/) | §7 Annotations — tags, metadata, `skip`/`fixme`/`fail`/`slow` |
| [`global-setup-lab/`](global-setup-lab/) | §8 Global setup & teardown — a `globalSetup` module + a device setup project |
| [`parallel-lab/`](parallel-lab/) | §9 Parallelism — workers, device pool, `autoDiscover` |
| [`parameterize-lab/`](parameterize-lab/) | §10 Parameterize — one test per data row, inline + external JSON |
| [`projects-lab/`](projects-lab/) | §14 Projects — an Android and an iOS device target, each with its own spec |
| [`merge-report-lab/`](merge-report-lab/) | §15 Reporters — shard with the blob reporter, then `merge-reports` into one HTML |
| [`retry-timeout-trace-lab/`](retry-timeout-trace-lab/) | §17–19 Retries (flaky flagging), timeouts, and the trace viewer |
| [`page-object-lab/`](page-object-lab/) | Page Object pattern — one spec on both Android & iOS via base + child page classes |
| [`cloud-debug-lab/`](cloud-debug-lab/) 🚧 | Run the page-object spec locally **and** on BrowserStack |

✅ start here · 🚧 scaffold — README + config stub ready, the spec is yours to capture

Each lab folder has its own `README.md` with the full walkthrough.

`config-lab/` breaks §6 into six runnable mini-projects:
[`1-tests-and-timing/`](config-lab/1-tests-and-timing/) ·
[`2-execution-and-output/`](config-lab/2-execution-and-output/) ·
[`3-use-app-and-session/`](config-lab/3-use-app-and-session/) ·
[`4-artifacts/`](config-lab/4-artifacts/) ·
[`5-device-providers/`](config-lab/5-device-providers/) ·
[`6-appium-server/`](config-lab/6-appium-server/)

## Two engines

| | **A — author / record / run (local)** | **B — AI-generate (`lime-cli`)** |
|---|---|---|
| You provide | locators + actions, or a recording | a plain-English **goal** |
| Drives the device | you, locally | the **LIME server** agent |
| Account needed | none | **LIME Pro** + token + agent |
| Output | `*.spec.ts` (run with `npx taqwright test`) | `*.spec.ts` (same — run locally) |

Both produce the **same artifact**: a spec that `import`s from `taqwright`. Every lab here is
Engine A, except the debug half of `cloud-debug-lab/`; Engine B needs a **LIME Pro account +
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

For `cloud-debug-lab/` you'll also want a [BrowserStack](https://www.browserstack.com/) account.
The `taqwright` skill is the authoritative reference for the `mobile` API, locator priority,
config, and `lime-cli`.

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
