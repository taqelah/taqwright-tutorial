import { defineConfig, Platform } from 'taqwright';

// §17-19 lab — the config sets the two "stars":
//   retries: 2   → a failing test reruns from a fresh session (§17). Fail-then-pass = "flaky".
//   trace: 'on'  → EVERY test records a trace you can scrub in the report (§19).
// Timeouts (§18) are exercised per-test in tests/timeouts.spec.ts.
export default defineConfig({
  testDir: './tests',
  timeout: 60_000, // per-test budget (§18) — override with test.setTimeout() / test.slow()
  expectTimeout: 30_000, // assertions + actions (§18) — override per call with { timeout }
  retries: 2, // §17 — rerun a failed test up to twice (or: npx taqwright test --retries 2)
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
        trace: 'on', // §19 — capture EVERY test (use 'on-failure' in CI to cut overhead)
      },
    },
  ],
});
