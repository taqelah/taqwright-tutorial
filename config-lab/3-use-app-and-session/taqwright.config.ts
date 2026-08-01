import { defineConfig, Platform } from 'taqwright';

// ┌─────────────────────────────────────────────────────────────────────────┐
// │ §6 · Configuration — the `use` block · app & session                    │
// │ Spotlight: which app, how it's installed, and per-project overrides.    │
// │ Everything here lives INSIDE a project's `use` (per device target).     │
// └─────────────────────────────────────────────────────────────────────────┘
export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],

  projects: [
    {
      name: 'android',
      use: {
        platform: Platform.ANDROID, // ANDROID | IOS — required

        // ── app + fresh state (the resetBetweenTests TRIO — type-required together) ──
        resetBetweenTests: true, // reinstall + relaunch before EVERY test → clean state
        buildPath: '../../app/DemoApp-v1.0.0.apk', // the .apk/.app to install (shared, repo root)
        appBundleId: 'com.taqelah.demo_app', // package id taqwright launches
        // Omit resetBetweenTests (or set false) → app left as-is; buildPath/appBundleId optional.

        // ── extra raw Appium capabilities, merged in ──
        capabilities: {
          'appium:autoGrantPermissions': true, // skip runtime permission dialogs
        },

        // ── per-project override of the global assertion/action budget ──
        expectTimeout: 20_000,

        device: { provider: 'emulator', autoDiscover: true, orientation: 'portrait' },
        appium: { autoStart: true, host: 'localhost', port: 4723, path: '/' },
        trace: 'on-failure',
      },
    },
  ],
});
