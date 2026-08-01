// Runs ONCE after all tests finish — clean up whatever global-setup created.
export default async function globalTeardown() {
  console.log('[global-teardown] runs once after all tests — tear down seeded data / sessions.');
}
