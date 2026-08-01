import { defineConfig, Platform } from 'taqwright';

// ┌─────────────────────────────────────────────────────────────────────────┐
// │ §6 · Configuration — `use` artifacts · trace · video · network          │
// │ Spotlight: what taqwright RECORDS while a test runs.                    │
// │ All three share the same modes: off | on | on-failure | retain-on-failure│
// └─────────────────────────────────────────────────────────────────────────┘
export default defineConfig({
  testDir: './tests',
  outputDir: './artifacts', // traces / videos land here
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

        // ── the three capture knobs ──────────────────────────────────────
        trace: 'on', // 🔎 per-action screenshots + page-source timeline — EVERY test here (→ show-report)
        video: 'on', // 🎥 screen recording (.mp4), kept only when a test fails
        network: 'off', // 🌐 HTTP traffic (HAR) — 'on-failure' to debug API calls
        // Modes for all three: 'off' (default) · 'on' (heavy) · 'on-failure' · 'retain-on-failure'
        // CI tip: prefer 'on-failure' — 'on' balloons artifact size and slows the run.
      },
    },
  ],
});
