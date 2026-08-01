// (1) globalSetup MODULE — runs ONCE before any worker starts. NO device here.
// Use it for pure backend prep: seed a database, fetch an auth token, write a fixture file.
// Note: this runs in the main process, so values you set on process.env do NOT reach the
// (separate) test workers — pass data via a written file or storage state instead. The proof
// that it ran is the line below in your console output.
export default async function globalSetup() {
  console.log('[globalSetup] no device — seed data / fetch tokens / write fixtures here.');
}
