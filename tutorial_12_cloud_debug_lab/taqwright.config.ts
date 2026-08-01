import { config as loadEnv } from 'dotenv';
// .env → process.env. `override: true` so .env wins even if your shell already exports
// BROWSERSTACK_* for a different account (otherwise dotenv keeps the shell value).
loadEnv({ override: true });
import { defineConfig, Platform } from 'taqwright';

// Cloud lab — reuses the page-object add-to-cart spec from tutorial_11_page_object_lab and runs it on
// BrowserStack. The SAME spec + SAME page objects drive a local emulator OR a real cloud device —
// only the project's `use` (device.provider + build) changes.
//   npx taqwright test --project android                # local emulator
//   npx taqwright test --project browserstack-android    # cloud Android  (creds via .env / env)
//   npx taqwright test --project browserstack-ios        # cloud iOS
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ ⚠️  THE bs://… APP IDs BELOW ARE THE AUTHOR'S — THEY WILL NOT WORK FOR YOU.               │
// │                                                                                          │
// │ A bs:// id is private to the BrowserStack account that uploaded it. Running as-is fails   │
// │ with "App not found" / 403. You must supply YOUR OWN app. Two ways:                      │
// │                                                                                          │
// │ (a) Upload once, reuse the id (fastest per run):                                         │
// │     curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \                          │
// │       -X POST https://api-cloud.browserstack.com/app-automate/upload \                   │
// │       -F "file=@../app/DemoApp-v1.0.0.apk"                                               │
// │     → returns {"app_url":"bs://<your-id>"} — put it in .env as TAQ_APK (same for the iOS │
// │       build ../app/DemoApp-v1.1.0-debug-ios.app.zip → TAQ_IPA), or paste it below.        │
// │                                                                                          │
// │ (b) Skip uploading — point at the local file and let taqwright upload it every run:      │
// │     TAQ_APK=../app/DemoApp-v1.0.0.apk npx taqwright test --project browserstack-android  │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
export default defineConfig({
  testDir: './tests',
  timeout: 180_000, // generous — BrowserStack device allocation can be slow
  expectTimeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],

  projects: [
    {
      name: 'android', // local emulator
      use: {
        platform: Platform.ANDROID,
        resetBetweenTests: true,
        buildPath: '../app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',
        device: { provider: 'emulator', autoDiscover: true, orientation: 'portrait' },
        appium: { autoStart: true, host: 'localhost', port: 4723, path: '/' },
        trace: 'on-failure',
      },
    },
    {
      // ── cloud Android: only device.provider + build change; creds via env/.env ──
      name: 'browserstack-android',
      timeout: 300_000,
      use: {
        platform: Platform.ANDROID,
        resetBetweenTests: true,
        // ⚠️ NOT YOUR APP — this id belongs to the author's BrowserStack account. Set TAQ_APK to
        //    your own bs://… (or to ../app/DemoApp-v1.0.0.apk to upload per run). See header.
        buildPath: process.env.TAQ_APK || 'bs://d055693dcfdaaa4214c6134b3f2ec89436290268',
        appBundleId: 'com.taqelah.demo_app',
        device: { provider: 'browserstack', name: 'Google Pixel 8', osVersion: '14.0' },
        appium: { connectionTimeout: 240_000 },
        trace: 'on',
        capabilities: {
          'bstack:options': {
            projectName: 'Demo Project',
            buildName: 'taqwright · tutorial_12_cloud_debug_lab',
            sessionName: 'add-to-cart (Android)',
            appiumVersion: '2.19.0',
            idleTimeout: 300,
          },
        },
      },
    },
    {
      // ── cloud iOS: same spec, iOS page object (factory picks it from the project name) ──
      name: 'browserstack-ios',
      timeout: 300_000,
      use: {
        platform: Platform.IOS,
        resetBetweenTests: true,
        // ⚠️ NOT YOUR APP — the author's iOS build id. Set TAQ_IPA to your own bs://… (or to
        //    ../app/DemoApp-v1.1.0-debug-ios.app.zip to upload per run). See header.
        buildPath: process.env.TAQ_IPA || 'bs://48171a56070aa1957a3f184a660fec8d4765efcb',
        appBundleId: 'com.taqelah.demoApp',
        device: { provider: 'browserstack', name: 'iPhone 15', osVersion: '17' },
        appium: { connectionTimeout: 240_000 },
        trace: 'on',
        capabilities: {
          'bstack:options': {
            projectName: 'Demo Project',
            buildName: 'taqwright · tutorial_12_cloud_debug_lab',
            sessionName: 'add-to-cart (iOS)',
            idleTimeout: 300,
          },
        },
      },
    },
  ],
});
