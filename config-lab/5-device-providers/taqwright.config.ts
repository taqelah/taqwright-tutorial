import { defineConfig, Platform } from 'taqwright';

// ┌─────────────────────────────────────────────────────────────────────────┐
// │ §6 · Configuration — `device` providers                                 │
// │ Spotlight: WHICH device, and how it's chosen.                           │
// │ 4 providers: emulator · local-device · browserstack · lambdatest        │
// │ Targeting precedence:  udid › pool › name › autoDiscover                │
// └─────────────────────────────────────────────────────────────────────────┘
export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],

  projects: [
    {
      name: 'android', // runnable default — a local emulator, auto-discovered
      use: {
        platform: Platform.ANDROID,
        resetBetweenTests: true,
        buildPath: '../../app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',
        appium: { autoStart: true, host: 'localhost', port: 4723, path: '/' },
        trace: 'on-failure',
        device: {
          provider: 'emulator', // local Android emulator / iOS simulator
          autoDiscover: true, // enumerate + boot whatever's available (default)
          orientation: 'portrait', // | 'landscape'
          // ── pick ONE targeting style instead of autoDiscover: ──
          // udid: 'emulator-5554',                      // pin one exact device (wins over name)
          // name: 'Pixel_7_API_34',                     // by AVD id / sim name (string | RegExp)
          // pool: [{ udid: 'emulator-5554' },           // explicit set for workers > 1
          //        { udid: 'emulator-5556' }],
        },
      },
    },

    // ── CLOUD providers — same specs, remote hardware. Creds from env, then: ──
    //   npx taqwright test --project browserstack
    // {
    //   name: 'browserstack',
    //   use: {
    //     platform: Platform.ANDROID,
    //     resetBetweenTests: true,
    //     buildPath: '../../app/DemoApp-v1.0.0.apk', // uploaded to the grid on run
    //     appBundleId: 'com.taqelah.demo_app',
    //     device: { provider: 'browserstack', name: 'Google Pixel 8', osVersion: '14.0' },
    //   },
    // },
    // { name: 'lambdatest', use: { platform: Platform.ANDROID, /* … */
    //     device: { provider: 'lambdatest', name: 'Pixel 8', osVersion: '14' } } },
  ],
});
