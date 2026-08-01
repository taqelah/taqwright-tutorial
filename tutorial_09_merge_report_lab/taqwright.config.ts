import { defineConfig, Platform } from 'taqwright';

// §15 Reporters — merge-report lab. Standard android baseline; the lesson is in the SCRIPTS:
//   npm run shard1   # --shard 1/2 --reporter blob → blob-report/report-1.zip → moved to all-blobs/
//   npm run shard2   # --shard 2/2 --reporter blob → blob-report/report-2.zip → moved to all-blobs/
//   npm run merge    # taqwright merge-reports all-blobs --reporter html  → ONE combined report
//   npm run report   # taqwright show-report
// (The blob reporter clears blob-report/ each run, so each shard moves its blob into all-blobs/.)
// `blob` is passed on the CLI (per shard); the config keeps human-readable list+html for normal runs.
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
