import { defineConfig, Platform, type TaqwrightProjectConfig } from 'taqwright';

// Page Object lab — TWO projects sharing ONE testDir, so the single add-to-cart.spec.ts runs on
// both. The spec picks the right page object (Android vs iOS) from the project name.
//   npx taqwright test --project android
//   npx taqwright test --project ios

// A config is just JavaScript, so it can react to its environment. `autoDiscover` resolves devices
// for EVERY project here during global setup — including ones `--project` excluded — so on a Linux
// CI runner (no iOS simulators) the ios project would abort the run before the android spec starts.
// Our CI gate sets TAQWRIGHT_ANDROID_ONLY=1 to trim it. Locally, leave it unset: you get both.
const androidOnly = process.env.TAQWRIGHT_ANDROID_ONLY === '1';

const ios: TaqwrightProjectConfig = {
  name: 'ios',
  use: {
    platform: Platform.IOS,
    resetBetweenTests: true,
    buildPath: '../app/DemoApp-v1.1.0-debug-ios.app.zip',
    appBundleId: 'com.taqelah.demoApp',
    device: { provider: 'emulator', autoDiscover: true, orientation: 'portrait' },
    appium: { autoStart: true, host: 'localhost', port: 4723, path: '/' },
    trace: 'on-failure',
  },
};

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
    ...(androidOnly ? [] : [ios]),
  ],
});
