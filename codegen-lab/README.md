# Codegen Lab — record a flow into a spec 🎥

> 🚧 **Scaffold** — this README outlines the exercise; the recorded spec is yours to capture
> live. The config stub is ready to go. (Fleshed out into a saved reference spec in a later pass.)

Instead of hand-writing locators, **record** them. taqwright's inspector watches the live screen,
ranks candidate locators by stability + uniqueness, and emits ready-to-paste test code as you tap —
Playwright-codegen style, for mobile.

> 🎥 **Watch first:** [Playwright-style codegen for mobile — Taqwright Codegen](https://www.youtube.com/watch?v=FBxFg1XbuKE) (TAQELAH Singapore).

## What you'll do

Record the **search → add to cart** flow on the demo-app (the same one
[`../page-object-lab/`](../page-object-lab/) builds by hand) and run the generated spec.

## Prerequisites

Same as [`../setup-lab/`](../setup-lab/README.md): **Node 24+**, a booted Android emulator, and the
shared APK at `../app/DemoApp-v1.0.0.apk`.

```bash
cd codegen-lab
npm install            # installs taqwright (aliased from @taqwright/taqwright)
```

## 1 · Inspect — rank locators

```bash
npx taqwright inspect      # opens the web inspector at http://localhost:4280
```

> ☁️ **Cloud devices too:** set `BROWSERSTACK_USERNAME` / `BROWSERSTACK_ACCESS_KEY`, then `inspect` /
> `codegen` can connect to a **real BrowserStack (or LambdaTest) device** — pick a device + OS, point
> at your uploaded app (`bs://…`), and get the same live screen + locator ranking + recording. See
> [`../cloud-debug-lab/`](../cloud-debug-lab/).

- **Live screen** on the left, the view tree + a **Locators** tab on the right.
- Select any element → the Locators tab generates candidates **per category** and **verifies each
  against the live screen** (how many match, is it unique), then recommends the best:
  - **Android:** `getById` → `getByUiSelector` → `getByXpath`
  - **iOS:** `getById` → `getByPredicate` → `getByClassChain` → `getByXpath`
- Not unique? it falls back to `.nth(i)`; positional locators are flagged as fragile.
- Lesson: take the recommended stable locator; treat positional/xpath as last resort.

## 2 · Codegen — auto-record

```bash
npx taqwright codegen      # = inspect --record (auto-records as you act)
```

Same inspector, but it **auto-records** as you drive the app. Tap through the flow:

1. Log in (`emma@demoapp.com` / `10203040`)
2. Open **Shop All** → search **"black dress"** → open the first result → **add to cart**

The **Recorded script** tab fills in with runnable taqwright code.

## 3 · Save & run

Paste the emitted script into `tests/search-add-to-cart.spec.ts`, then:

```bash
npx taqwright test
npx taqwright show-report
```

## 4 · Reference — what codegen captures 📋

Codegen records **actions, gestures, and assertions** (not just actions):

- **Gesture / screen:** `tap` · `swipe` · `screenScroll`
- **Touch:** `click` · `doubleTap` · `longPress` · `press` · `focus` · `blur`
- **Input & controls:** `fill` · `clear` · `pressSequentially` · `check`/`uncheck` ·
  `selectOption` (label / index / date / time)
- **Movement:** `swipe` · `scrollIntoView` · `pinch` (in/out) · `dragTo`(target)
- **Other:** `sendKeys` · `switchContext` (native↔webview) · `comment`
- **Assertions → auto-retrying `expect()`:** visible/hidden · enabled/disabled · text (exact|contains)
  · value · checked/unchecked · editable/readonly · focused · attached · empty · inViewport · count · attribute

**Export beyond TypeScript:** the same recording can be emitted as **Python** or **Java** Appium
steps — handy if your team isn't on the taqwright runner yet.

## 5 · Clean up the recording ✨

Recorded code is a starting point, not the finished test. Improve it:

- Replace any positional / xpath locators with the **recommended stable** one from the Locators tab.
- Keep the recorded `expect()` assertions; add any the run is missing.
- Remove duplicated waits — taqwright actions already auto-wait.

## 🐞 Live debug — `mobile.pause()`

Drop `await mobile.pause()` mid-test and the inspector **attaches to that running session** — inspect,
build locators, record more, then hit **resume**. `PWDEBUG=0` disables pause in CI so runs never hang.

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| Inspector won't connect | Emulator booted? `adb devices`. Appium reachable on `:4723`? |
| Recorded locator is an ugly xpath | Pick a higher-ranked locator from the Locators tab and edit the spec. |
| Recorded spec lands on Home, not Login | App stayed logged in — relaunch in a `beforeEach`, or `adb shell pm clear com.taqelah.demo_app`. |
