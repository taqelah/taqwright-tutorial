import { defineConfig, Platform } from 'taqwright';

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
        // Reinstall the APK before every test for a guaranteed-clean app state.
        // resetBetweenTests + buildPath + appBundleId are type-required together.
        // Uses the shared binary committed at the repo root (../app/).
        resetBetweenTests: true,
        buildPath: '../app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',
        device: {
          provider: 'emulator',
          autoDiscover: true, // enumerate + boot an available emulator — no fixed AVD name needed
          orientation: 'portrait',
          // Pin a specific AVD instead of autoDiscover? Set name (from `npx taqwright devices`); a regex also matches.
          // name: 'Pixel_7_API_34',
        },
        appium: {
          autoStart: true, // spawn Appium on :4723 if nothing is listening
          host: 'localhost',
          port: 4723,
          path: '/',
        },
        trace: 'on-failure',
      },
    },
  ],
});
