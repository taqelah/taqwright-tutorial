import { defineConfig, Platform } from 'taqwright';

// §10 Parameterize lab — standard runnable baseline; the lesson is in the specs:
//   tests/parameterize.spec.ts  → loop an inline data array → one test() per row
//   tests/from-json.spec.ts     → same, driven from data/accounts.json (external data)
// Fresh state per test comes from resetBetweenTests + buildPath (reinstall before each test).
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expectTimeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],

  projects: [
    {
      name: 'android',
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
  ],
});
