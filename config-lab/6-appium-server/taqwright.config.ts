import { defineConfig, Platform } from 'taqwright';

// ┌─────────────────────────────────────────────────────────────────────────┐
// │ §6 · Configuration — the `appium` server                                │
// │ Spotlight: how taqwright reaches (or starts) the Appium server.         │
// └─────────────────────────────────────────────────────────────────────────┘
export default defineConfig({
  testDir: './tests',
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
        trace: 'on-failure',

        // ── the Appium server connection ─────────────────────────────────
        appium: {
          autoStart: true, // spawn Appium on host:port if nothing is already listening
          autoStartDevice: false, // cold-boot an OFFLINE emulator (needs a string device.name)
          host: 'localhost', // where the server lives
          port: 4723, // default Appium port
          path: '/', // base path (Appium 2/3 default '/'; some setups use '/wd/hub')
          newCommandTimeout: 60, // seconds of inactivity before Appium kills the session
          connectionTimeout: 5_000, // ms to wait for the server to respond
          logLevel: 'info', // trace | debug | info | warn | error | silent
        },
      },
    },
  ],
});
