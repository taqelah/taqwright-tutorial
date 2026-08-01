import { defineConfig, Platform } from 'taqwright';

// ┌─────────────────────────────────────────────────────────────────────────┐
// │ §6 · Configuration — TOP-LEVEL · tests & timing                         │
// │ Spotlight: how taqwright FINDS tests and how long it gives them.        │
// │ The `projects[]` block below is just enough to make the spec runnable.  │
// └─────────────────────────────────────────────────────────────────────────┘
export default defineConfig({
  // ── which files are tests ───────────────────────────────────────────────
  testDir: './tests', // root folder scanned for specs (relative to THIS file)
  // testMatch: '**/*.spec.ts',     // what counts as a test (default shown)
  // testIgnore: '**/wip/**',       // files to skip

  // ── how long they get ───────────────────────────────────────────────────
  timeout: 45_000, // ⏱️ per-TEST budget (hooks included). Override: test.setTimeout() / test.slow()
  expectTimeout: 15_000, // ⏳ bounds every assertion AND action; taqwright polls each every 200 ms
  retries: 1, // 🔁 re-run a failed test from scratch; a pass-after-retry is flagged "flaky" (deep dive: §14)

  reporter: [['list'], ['html', { open: 'never' }]],

  projects: [
    {
      name: 'android',
      use: {
        platform: Platform.ANDROID,
        resetBetweenTests: true,
        buildPath: '../../app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',
        device: { provider: 'emulator', autoDiscover: true, orientation: 'portrait' },
        appium: { autoStart: true, host: 'localhost', port: 4723, path: '/' },
        trace: 'on-failure',
      },
    },
  ],
});
