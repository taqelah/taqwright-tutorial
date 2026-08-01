import { defineConfig, Platform } from 'taqwright';

// §8 GLOBAL SETUP & TEARDOWN — this config shows BOTH mechanisms.
// Run `npm test` and watch the order:
//   [globalSetup] → setup project ('sign in once') → android tests → [globalTeardown]

// Shared device target, reused by both the 'setup' and 'android' projects.
const androidUse = {
  platform: Platform.ANDROID,
  resetBetweenTests: true,
  buildPath: '../app/DemoApp-v1.0.0.apk',
  appBundleId: 'com.taqelah.demo_app',
  device: { provider: 'emulator', autoDiscover: true, orientation: 'portrait' },
  appium: { autoStart: true, host: 'localhost', port: 4723, path: '/' },
  trace: 'on-failure',
} as const;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expectTimeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],

  // ── (1) No-device modules — run ONCE around the whole suite (backend prep) ──
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  projects: [
    // ── (2) Setup PROJECT — full device access, runs BEFORE 'android' (dependency) ──
    { name: 'setup', testMatch: /global\.setup\.ts/, use: androidUse },

    // The real tests. 'setup' must finish first; default testMatch (**/*.spec.ts)
    // won't pick up global.setup.ts, so no testIgnore needed.
    { name: 'android', dependencies: ['setup'], use: androidUse },
  ],
});
