// (1) globalTeardown MODULE — runs ONCE after the whole suite finishes. NO device.
// Clean up whatever globalSetup created (seeded rows, temp files, sessions).
export default async function globalTeardown() {
  console.log('[globalTeardown] no device — tear down seeded data / sessions here.');
}
