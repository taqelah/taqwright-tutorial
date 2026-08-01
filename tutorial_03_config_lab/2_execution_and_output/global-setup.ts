// Runs ONCE before any test — no device, pure backend work (seed data, hit an API, set env).
// Whatever it returns is ignored; throwing here aborts the whole run.
export default async function globalSetup() {
  console.log('[global-setup] runs once before all tests — seed data / sign-in tokens / etc.');
}
