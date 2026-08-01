import { defineConfig, Platform } from 'taqwright';

// §14 PROJECTS — a project is a named group of tests with ONE `use` (platform · device · build).
// Here: two device-target projects, each with its own testDir + login spec.
//   npx taqwright test --project android          # just Android
//   npx taqwright test --project ios              # just iOS (macOS + simulator)
//   npx taqwright test --project android --project ios   # both (repeatable flag)
//   npx taqwright test                            # all projects
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expectTimeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],

  projects: [
    {
      name: 'android',
      testDir: './tests/android',
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
      name: 'ios',
      testDir: './tests/ios',
      use: {
        platform: Platform.IOS,
        resetBetweenTests: true,
        // iOS simulator build (Runner.app, zipped — committed in app/) + the iOS bundle id
        // (camelCase, differs from Android).
        buildPath: '../app/DemoApp-v1.1.0-debug-ios.app.zip',
        appBundleId: 'com.taqelah.demoApp',
        device: { provider: 'emulator', autoDiscover: true, orientation: 'portrait' }, // auto-detect a simulator
        appium: { autoStart: true, host: 'localhost', port: 4723, path: '/' },
        trace: 'on-failure',
      },
    },
  ],

  // Other project fields (from the §14 slide): `dependencies` (a project runs after the ones it
  // depends on — and is skipped if a dependency fails) · `testMatch` / `testIgnore`.
});
