import { config as loadEnv } from 'dotenv';
// .env → process.env. `override: true` so .env wins even if your shell already exports
// BROWSERSTACK_* for a different account (otherwise dotenv keeps the shell value).
loadEnv({ override: true });
import { defineConfig, Platform } from 'taqwright';

// Cloud lab — reuses the page-object add-to-cart spec from page-object-lab and runs it on
// BrowserStack. The SAME spec + SAME page objects drive a local emulator OR a real cloud device —
// only the project's `use` (device.provider + build) changes.
//   npx taqwright test --project android                # local emulator
//   npx taqwright test --project browserstack-android    # cloud Android  (creds via .env / env)
//   npx taqwright test --project browserstack-ios        # cloud iOS
// Apps are PRE-UPLOADED to BrowserStack (bs://… ids) — no per-run upload. Override with TAQ_APK / TAQ_IPA.
// NOTE: the bs://… ids below are scoped to the account that uploaded them and will NOT resolve for
// yours. Either upload the binaries in ../app/ to your own BrowserStack account and set
// TAQ_APK / TAQ_IPA to the ids it returns, or point them at the local files to upload per run:
//   TAQ_APK=../app/DemoApp-v1.0.0.apk npx taqwright test --project browserstack-android
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
        buildPath: process.env.TAQ_APK || 'bs://d055693dcfdaaa4214c6134b3f2ec89436290268',
        appBundleId: 'com.taqelah.demo_app',
        device: { provider: 'browserstack', name: 'Google Pixel 8', osVersion: '14.0' },
        appium: { connectionTimeout: 240_000 },
        trace: 'on',
        capabilities: {
          'bstack:options': {
            projectName: 'Demo Project',
            buildName: 'taqwright · cloud-debug-lab',
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
        buildPath: process.env.TAQ_IPA || 'bs://48171a56070aa1957a3f184a660fec8d4765efcb',
        appBundleId: 'com.taqelah.demoApp',
        device: { provider: 'browserstack', name: 'iPhone 15', osVersion: '17' },
        appium: { connectionTimeout: 240_000 },
        trace: 'on',
        capabilities: {
          'bstack:options': {
            projectName: 'Demo Project',
            buildName: 'taqwright · cloud-debug-lab',
            sessionName: 'add-to-cart (iOS)',
            idleTimeout: 300,
          },
        },
      },
    },
  ],
});
