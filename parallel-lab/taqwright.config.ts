import { defineConfig, Platform } from 'taqwright';

// §9 PARALLELISM lab — adapted from the official taqwright-demo config
// (github.com/Taqwright/taqwright-demo). Four local-Android strategies against the demo-app
// (the cloud/iOS projects from the demo are omitted here). App path → this repo's ../app/.
// Run one strategy at a time:  npx taqwright test --project <name>
export default defineConfig({
  testDir: './tests',
  // Generous per-test cap: BrowserStack device allocation + app install + driver
  // init can take well over 60s before the test body even runs. Local runs finish
  // in ~12s, so the higher ceiling is harmless there.
  timeout: 180_000,
  expectTimeout: 30_000,
  // Re-run a failed test once — backstop for a transient device "offline" blip
  // mid-test-body; the rerun lands on the (by then recovered) emulator.
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  // PER-PROJECT `workers` (effective = project.workers ?? config.workers ?? 1).
  // Global default stays 1; we set `workers` only on the projects that need it.
  // `npx taqwright test --project X` injects X's worker count into Playwright's pool.
  // A project's `workers` must be <= its device count (pool length / discovered AVDs).
  fullyParallel: true,
  projects: [
    {
      // (1) Single local emulator, pinned to ONE serial. No `workers` → default 1.
      // autoStartDevice cold-boots the named AVD if not running, then attaches to `udid`.
      //   npx taqwright test --project android-single
      name: 'android-single',
      testDir: './tests/android',
      use: {
        platform: Platform.ANDROID,
        device: {
          provider: 'emulator',
          name: 'Pixel_10_Pro_XL', // AVD id — required for autoStartDevice to cold-boot
          udid: 'emulator-5554', // pin/attach to this serial once booted
        },
        appium: { autoStart: true, autoStartDevice: true, host: 'localhost', port: 4723, path: '/' },
        buildPath: process.env.TAQ_APK || '../app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',
        resetBetweenTests: true,
      },
    },
    {
      // (2) Fixed pool of TWO emulators, run 2-wide. `workers` (2) must be <= pool
      // length — one worker per pool entry. autoStartDevice pre-boots both AVDs up
      // front and waits until ready, so a cold start never hits the concurrent-boot
      // "device offline" race. Two parallel emulators need two distinct AVDs.
      // Worker i spawns Appium on 4723 + i.
      //   npx taqwright test --project android-pool-2
      name: 'android-pool-2',
      testDir: './tests/android',
      workers: 2,
      use: {
        platform: Platform.ANDROID,
        device: {
          provider: 'emulator',
          pool: [
            { name: 'Pixel_10_Pro_XL', udid: 'emulator-5554' }, // AVD id + serial
            { name: 'Pixel_10_Pro_XL_2', udid: 'emulator-5556' },
          ],
        },
        appium: {
          autoStart: true, // worker i spawns Appium on 4723 + i
          autoStartDevice: true, // cold-boot each pool entry by its AVD `name`
          host: 'localhost',
          port: 4723, // base port; per-worker offset added automatically
          path: '/',
        },
        buildPath: process.env.TAQ_APK || '../app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',
        resetBetweenTests: true,
        trace: 'on-failure',
        video: 'on-failure',
      },
    },
    {
      // (3) Auto-detect devices, SERIAL (workers: 1). autoDiscover enumerates the
      // host's AVDs at run start; with 1 worker it uses the first booted one.
      //   npx taqwright test --project android-auto-1     ← runs anywhere
      name: 'android-auto-1',
      testDir: './tests/android',
      workers: 1,
      use: {
        platform: Platform.ANDROID,
        device: { provider: 'emulator', autoDiscover: true }, // resolve & assign workers AVDs — no pool
        appium: { autoStart: true, host: 'localhost', port: 4723, path: '/' },
        buildPath: process.env.TAQ_APK || '../app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',
        resetBetweenTests: true,
        trace: 'on-failure',
        video: 'on-failure',
      },
    },
    {
      // (4) Auto-detect devices, 2-wide (workers: 2). autoDiscover assigns 2 of the
      // host's AVDs — needs >= 2 booted AVDs. Worker i spawns Appium on 4723 + i.
      //   npx taqwright test --project android-auto-2     ← runs anywhere (2 AVDs)
      name: 'android-auto-2',
      testDir: './tests/android',
      workers: 2,
      use: {
        platform: Platform.ANDROID,
        device: { provider: 'emulator', autoDiscover: true },
        appium: { autoStart: true, host: 'localhost', port: 4723, path: '/' },
        buildPath: process.env.TAQ_APK || '../app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',
        resetBetweenTests: true,
        trace: 'on-failure',
        video: 'on-failure',
      },
    },
  ],
});
