import { defineConfig, Platform } from 'taqwright';

// ┌─────────────────────────────────────────────────────────────────────────┐
// │ §6 · Configuration — TOP-LEVEL · execution & output                     │
// │ Spotlight: HOW MANY tests run at once + WHERE results go.               │
// │ These are run-wide keys — they can't live in projects[].               │
// └─────────────────────────────────────────────────────────────────────────┘
export default defineConfig({
  testDir: './tests',

  // ── execution ───────────────────────────────────────────────────────────
  workers: 1, // ⚡ parallel device workers. Set 2 to fan out (needs 2 devices). (deep dive: §10)
  // workers: 2,
  fullyParallel: false, // split tests WITHIN a file across workers (not just whole files)
  forbidOnly: true, // 🚧 fail the run if a stray `test.only` was committed — great for CI

  // ── output ──────────────────────────────────────────────────────────────
  outputDir: './artifacts', // where traces / videos / attachments land
  reporter: [
    ['list'], // pretty console output
    ['html', { open: 'never' }], // browsable report → npx taqwright show-report
    ['json', { outputFile: 'report.json' }], // machine-readable (deep dive: §13)
  ],

  // ── run once, around everything (no device) ─────────────────────────────
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

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
