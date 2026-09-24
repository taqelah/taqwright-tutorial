import { defineConfig, Platform } from '@taqwright/taqwright';

// Every config knob is listed here. Essentials are uncommented; everything
// else is a commented placeholder you can enable by removing the leading
// "// ". Hover any field in your editor for the full type docs.
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expectTimeout: 30_000,
  // 'html' writes playwright-report/ — view it with: npx taqwright show-report
  reporter: [['list'], ['html', { open: 'never', title: 'Taqwright Test Report' }]],

  // ─── Optional top-level overrides ─────────────────────────────────
  // retries: 1,
  // outputDir: './test-results',
  // Split the tests inside one file across workers (needed for android-parallel —
  // our 3 tests share one file). Projects with 1 worker still run one test at a time.
  fullyParallel: true,
  // forbidOnly: !!process.env.CI,
  // testMatch: ['**/*.spec.ts'],
  // testIgnore: ['**/wip/**'],
  // globalSetup: './setup.ts',
  // globalTeardown: './teardown.ts',

  projects: [
    {
      name: 'android',
      use: {
        platform: Platform.ANDROID,
        device: {
          provider: 'emulator',
          name: 'taqwright_api34',          // your detected AVD
          // osVersion: '14',
          // udid: 'emulator-5554',
          // orientation: 'portrait',
          //
          // ─── Parallel runs (optional) ────────────────────────────
          // Declare a pool of devices to fan tests out across, then
          // bump `workers` at the top of this config to match. Worker
          // N picks pool[N]; `workers > pool.length` fails fast. Each
          // worker gets its own Appium + driver ports auto-staggered.
          // pool: [
          //   { udid: 'emulator-5554', name: 'Pixel_7_API_34' },
          //   { udid: 'emulator-5556', name: 'Pixel_7_API_34_2' },
          //   { udid: 'emulator-5558', name: 'Pixel_7_API_34_3' },
          // ],
          //
          // Or skip the pool entirely and let taqwright discover local
          // devices and partition them across `workers` for you — it
          // cold-boots shutdown AVDs/simulators to reach the count and
          // fails fast if too few are available. Mutually exclusive with
          // `pool` / `udid`.
          // autoDiscover: true,
        },
        // Spawn `npx appium` automatically when nothing is listening on
        // the configured host:port. Set `autoStart: false` to manage
        // Appium yourself (e.g. an Appium server you start by hand).
        appium: {
          autoStart: true,
          // Boot an offline Android emulator automatically. Needs a
          // string device.name equal to the AVD id (e.g. 'Pixel_7_API_34',
          // see 'emulator -list-avds'); a RegExp name is rejected at
          // config load. iOS simulators boot via XCUITest regardless.
          autoStartDevice: true,   // cold-boots the taqwright_api34 AVD
          host: 'localhost',
          port: 4723,           // Appium 3 default
          path: '/',            // Appium 3 default (Appium 1.x used '/wd/hub')
          // newCommandTimeout: 240,
          // logLevel: 'warn',
        },

        // ─── Reset between tests ────────────────────────────────────
        // Bound to the bundled demo app (app/DemoApp-v1.0.0.apk).
        // resetBetweenTests reinstalls + relaunches it fresh before every
        // test, so each starts from a known state. All three are
        // type-required together.
        resetBetweenTests: true,
        buildPath: './app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',

        // ─── Extra capabilities (escape hatch) ──────────────────────
        // Anything Appium accepts; merged on top of the auto-built caps.
        // capabilities: {
        //   'appium:autoGrantPermissions': true,
        //   'appium:autoAcceptAlerts': true,
        // },

        // ─── Per-project locator-action timeout (ms) ────────────────
        // Overrides the top-level `expectTimeout` for this project only.
        // expectTimeout: 30_000,

        // ─── Trace artifact ─────────────────────────────────────────
        // Captures a per-action screenshot + page-source timeline as a
        // self-contained `trace.html` under the test's output dir, also
        // attached to the Playwright HTML report. Adds one screenshot +
        // page-source round-trip per action (~100–300ms local, more
        // over USB) — recommended for CI: 'on-failure'.
        //   'off'                — no overhead (default)
        //   'on'                 — every test
        //   'on-failure'         — only failed tests
        //   'retain-on-failure'  — alias of 'on-failure' on mobile
        trace: 'on-failure',   // ← trace

        // ─── Screen recording (video) ───────────────────────────────
        // Records the device screen via Appium for the whole run and
        // attaches a screen.mp4 to the Playwright HTML report (as
        // 'taqwright-video'). No per-action cost like trace, but every
        // run pays the device recorder + an mp4 transfer at teardown —
        // recommended for CI: 'on-failure'. iOS-simulator support varies.
        //   'off'                — no recording (default)
        //   'on'                 — every test
        //   'on-failure'         — only failed tests
        //   'retain-on-failure'  — alias of 'on-failure' on mobile
        video: 'on-failure',

        // ─── Network capture (HAR) ──────────────────────────────────
        // Routes app traffic through a local MITM proxy and attaches a
        // HAR 1.2 file to the Playwright HTML report (as 'taqwright-har').
        // Zero-touch on userdebug Android emulators and iOS Simulators —
        // taqwright generates its own CA, installs it on the device, sets
        // the device/host proxy, and tears everything down on teardown
        // (including crash paths). Cloud projects skip this (the hub
        // captures HAR server-side); real devices and Google Play AVDs
        // are skipped with a note in the artifact.
        //   'off'                — no capture (default)
        //   'on'                 — every test
        //   'on-failure'         — only failed tests
        //   'retain-on-failure'  — alias of 'on-failure' on mobile
        // network: 'on-failure',
      },

      // ─── Per-project test-runner overrides ────────────────────────
      // timeout: 90_000,
      // retries: 2,
      // grep: /smoke/,
      // grepInvert: /flaky/,
      // dependencies: ['setup'],
      testMatch: ['**/android/**'],
    },

    // ─── Android — parallel on 2 local emulators ────────────────────
    //   npx taqwright test --project android-parallel
    // Worker 0 → pool[0] + Appium :4723 · worker 1 → pool[1] + Appium :4724.
    // workers must be <= pool size; the same AVD can't be listed twice.
    {
      name: 'android-parallel',
      workers: 2,                     // 2 tests at once (fullyParallel is set at the top)
      use: {
        platform: Platform.ANDROID,
        device: {
          provider: 'emulator',
          pool: [                     // one emulator per worker (AVD name + serial)
            { name: 'taqwright_api34', udid: 'emulator-5554' },
            { name: 'Pixel_7_API_34',  udid: 'emulator-5556' },
          ],
        },
        appium: {
          autoStart: true,            // worker i starts its own Appium on 4723 + i
          autoStartDevice: true,      // cold-boots each pool AVD by name
          host: 'localhost',
          port: 4723,                 // base port
          path: '/',
        },
        resetBetweenTests: true,
        buildPath: './app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',
        trace: 'on-failure',   // ← trace
        video: 'on-failure',
      },
      testMatch: ['**/android/**'],
    },

    // ─── Android — parallel, emulators auto-detected ────────────────
    //   npx taqwright test --project android-auto
    // No AVD names or serials: taqwright finds the emulators on this machine
    // and gives each worker its own one. Boot 2 emulators first for 2-wide.
    {
      name: 'android-auto',
      workers: 2,                     // 2 tests at once — needs >= 2 emulators
      use: {
        platform: Platform.ANDROID,
        device: {
          provider: 'emulator',
          autoDiscover: true,         // find emulators — no pool, no names
        },
        appium: {
          autoStart: true,            // worker i starts its own Appium on 4723 + i
          host: 'localhost',
          port: 4723,
          path: '/',
        },
        resetBetweenTests: true,
        buildPath: './app/DemoApp-v1.0.0.apk',
        appBundleId: 'com.taqelah.demo_app',
        trace: 'on-failure',   // ← trace
        video: 'on-failure',
      },
      testMatch: ['**/android/**'],
    },
    {
      name: 'ios',
      use: {
        platform: Platform.IOS,
        device: {
          provider: 'emulator',
          name: 'iPhone 17',                // your booted simulator
          osVersion: '26.5',
          udid: '30FA4507-4CED-49F7-805A-A40DA229CC13',
          // orientation: 'portrait',
          //
          // ─── Parallel runs (optional) ────────────────────────────
          // Declare a pool of devices to fan tests out across, then
          // bump `workers` at the top of this config to match. Worker
          // N picks pool[N]; `workers > pool.length` fails fast. Each
          // worker gets its own Appium + driver ports auto-staggered.
          // pool: [
          //   { udid: 'emulator-5554', name: 'Pixel_7_API_34' },
          //   { udid: 'emulator-5556', name: 'Pixel_7_API_34_2' },
          //   { udid: 'emulator-5558', name: 'Pixel_7_API_34_3' },
          // ],
          //
          // Or skip the pool entirely and let taqwright discover local
          // devices and partition them across `workers` for you — it
          // cold-boots shutdown AVDs/simulators to reach the count and
          // fails fast if too few are available. Mutually exclusive with
          // `pool` / `udid`.
          // autoDiscover: true,
        },
        // Spawn `npx appium` automatically when nothing is listening on
        // the configured host:port. Set `autoStart: false` to manage
        // Appium yourself (e.g. an Appium server you start by hand).
        appium: {
          autoStart: true,
          // Boot an offline Android emulator automatically. Needs a
          // string device.name equal to the AVD id (e.g. 'Pixel_7_API_34',
          // see 'emulator -list-avds'); a RegExp name is rejected at
          // config load. iOS simulators boot via XCUITest regardless.
          // autoStartDevice: true,
          host: 'localhost',
          port: 4723,           // Appium 3 default
          path: '/',            // Appium 3 default (Appium 1.x used '/wd/hub')
          // newCommandTimeout: 240,
          // logLevel: 'warn',
        },

        // ─── Reset between tests ────────────────────────────────────
        // Bound to the bundled demo app (app/DemoApp-v1.0.0.app, a
        // simulator build). resetBetweenTests reinstalls + relaunches it
        // fresh before every test, so each starts from a known state.
        // All three are type-required together.
        resetBetweenTests: true,
        buildPath: './app/DemoApp-v1.0.0.app',
        appBundleId: 'com.taqelah.demoApp',

        // ─── Extra capabilities (escape hatch) ──────────────────────
        // Anything Appium accepts; merged on top of the auto-built caps.
        // capabilities: {
        //   'appium:autoGrantPermissions': true,
        //   'appium:autoAcceptAlerts': true,
        // },

        // ─── Per-project locator-action timeout (ms) ────────────────
        // Overrides the top-level `expectTimeout` for this project only.
        // expectTimeout: 30_000,

        // ─── Trace artifact ─────────────────────────────────────────
        // Captures a per-action screenshot + page-source timeline as a
        // self-contained `trace.html` under the test's output dir, also
        // attached to the Playwright HTML report. Adds one screenshot +
        // page-source round-trip per action (~100–300ms local, more
        // over USB) — recommended for CI: 'on-failure'.
        //   'off'                — no overhead (default)
        //   'on'                 — every test
        //   'on-failure'         — only failed tests
        //   'retain-on-failure'  — alias of 'on-failure' on mobile
        trace: 'on-failure',   // ← trace

        // ─── Screen recording (video) ───────────────────────────────
        // Records the device screen via Appium for the whole run and
        // attaches a screen.mp4 to the Playwright HTML report (as
        // 'taqwright-video'). No per-action cost like trace, but every
        // run pays the device recorder + an mp4 transfer at teardown —
        // recommended for CI: 'on-failure'. iOS-simulator support varies.
        //   'off'                — no recording (default)
        //   'on'                 — every test
        //   'on-failure'         — only failed tests
        //   'retain-on-failure'  — alias of 'on-failure' on mobile
        video: 'on-failure',

        // ─── Network capture (HAR) ──────────────────────────────────
        // Routes app traffic through a local MITM proxy and attaches a
        // HAR 1.2 file to the Playwright HTML report (as 'taqwright-har').
        // Zero-touch on userdebug Android emulators and iOS Simulators —
        // taqwright generates its own CA, installs it on the device, sets
        // the device/host proxy, and tears everything down on teardown
        // (including crash paths). Cloud projects skip this (the hub
        // captures HAR server-side); real devices and Google Play AVDs
        // are skipped with a note in the artifact.
        //   'off'                — no capture (default)
        //   'on'                 — every test
        //   'on-failure'         — only failed tests
        //   'retain-on-failure'  — alias of 'on-failure' on mobile
        // network: 'on-failure',
      },

      // ─── Per-project test-runner overrides ────────────────────────
      // timeout: 90_000,
      // retries: 2,
      // grep: /smoke/,
      // grepInvert: /flaky/,
      // dependencies: ['setup'],
      testMatch: ['**/ios/**'],
    },

    // ─── LambdaTest (real devices) ──────────────────────────────────
    // Same test files as the local projects — only the device + app change.
    // Needs LAMBDATEST_USERNAME / LAMBDATEST_ACCESS_KEY in the env.
    //   npx taqwright test --project lambdatest-android
    //   npx taqwright test --project lambdatest-ios
    {
      name: 'lambdatest-android',
      use: {
        platform: Platform.ANDROID,
        device: {
          provider: 'lambdatest',
          name: 'Pixel 8',
          osVersion: '14',
        },
        resetBetweenTests: true,
        buildPath: 'lt://APP101602071790272933857933',   // uploaded APK
        appBundleId: 'com.taqelah.demo_app',
        trace: 'on-failure',   // ← trace
        video: 'on-failure',
      },
      testMatch: ['**/android/**'],
    },
    {
      name: 'lambdatest-ios',
      use: {
        platform: Platform.IOS,
        device: {
          provider: 'lambdatest',
          name: 'iPhone 15',
          osVersion: '17',
        },
        resetBetweenTests: true,
        buildPath: 'lt://APP10160372241789400782563395', // uploaded iOS build
        appBundleId: 'com.taqelah.demoApp',
        trace: 'on-failure',   // ← trace
        video: 'on-failure',
      },
      testMatch: ['**/ios/**'],
    },

    // ─── Cloud examples (BrowserStack / LambdaTest / Digital.ai) ────
    // Uncomment a block below to add a cloud project. Set the matching
    // env vars before launching:
    //   BROWSERSTACK_USERNAME  / BROWSERSTACK_ACCESS_KEY
    //   LAMBDATEST_USERNAME     / LAMBDATEST_ACCESS_KEY
    //   DIGITALAI_CLOUD_SERVER  / DIGITALAI_ACCESS_KEY   (no username)
    // For now, cloud devices are wired through the inspector
    // ('taqwright inspect'); cloud test-runner support lands separately.
    //
    // {
    //   name: 'browserstack',
    //   use: {
    //     platform: Platform.ANDROID,
    //     device: {
    //       provider: 'browserstack',
    //       name: 'Google Pixel 8',
    //       osVersion: '14.0',
    //       orientation: 'portrait',
    //     },
    //     resetBetweenTests: true,
    //     buildPath: 'bs://<app-id-from-app-upload>',
    //     appBundleId: 'com.example.app',
    //   },
    // },
    // {
    //   name: 'lambdatest',
    //   use: {
    //     platform: Platform.IOS,
    //     device: {
    //       provider: 'lambdatest',
    //       name: 'iPhone 15',
    //       osVersion: '17',
    //     },
    //     resetBetweenTests: true,
    //     buildPath: 'lt://<app-id-from-app-upload>',
    //     appBundleId: 'com.example.MyApp',
    //   },
    // },
    // {
    //   name: 'digitalai',
    //   use: {
    //     platform: Platform.ANDROID,
    //     device: {
    //       provider: 'digitalai',
    //       name: 'Galaxy S24',
    //       osVersion: '14',
    //       // deviceQuery: "@os='android' and @category='PHONE'", // optional: raw selection query (overrides name/osVersion)
    //     },
    //     resetBetweenTests: true,
    //     // A local .apk/.ipa is uploaded automatically, or pass 'cloud:com.example.app'
    //     // if the build is already in your Digital.ai cloud.
    //     buildPath: '/absolute/path/to/app.apk',
    //     appBundleId: 'com.example.app',
    //   },
    // },
  ],
});
