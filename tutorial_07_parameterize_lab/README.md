# Parameterize Lab — one test per data row 🔢

A focused mini-project for **§10 · Parameterize tests**. Instead of copy-pasting a test per
account, you **loop over data** and taqwright creates one `test()` per row.

This lab is **complete and runnable**.

```text
tutorial_07_parameterize_lab/
├── taqwright.config.ts
├── data/
│   └── accounts.json       external data source
└── tests/
    ├── parameterize.spec.ts   inline data array → one test per row
    └── from-json.spec.ts      same loop, data loaded from data/accounts.json
```

## Run

```bash
cd tutorial_07_parameterize_lab
nvm use 24
npm install

npx taqwright test --list                       # one test PER account (collection-time)
npx taqwright test tests/parameterize.spec.ts    # run the inline-array set
npx taqwright test tests/from-json.spec.ts       # run the JSON-driven set
npx taqwright show-report
```

`--list` is the key thing to see: each data row becomes its own named test
(`login as standard user`, `login as wrong password`, …).

## The pattern

```ts
const accounts = [ /* rows */ ];
for (const a of accounts) {
  test(`login as ${a.label}`, async ({ mobile }) => { /* drive the flow with a.* */ });
}
```

- Build the `test()`s **at collection time** — the loop runs before any test, so `--list` already
  shows them all.
- `from-json.spec.ts` reads `data/accounts.json` the same way — swap the file, the test list changes,
  **no code edit**. (A CSV would parse the same way.)
- Each row carries `expectHome` so one parameterized test covers both the happy path and failures.

## Also (mentioned on the slide)

- **Option fixtures** — `test.extend` a fixture, then `test.use({ account })` per file/block:
  ```ts
  const test = base.extend<{ account: Account }>({ account: [accounts[0], { option: true }] });
  ```
- **Project-based** — the same specs across multiple `projects[]` (e.g. devices/locales) — see §11.

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `--list` shows only 1 test | The loop must be at module top level (collection time), not inside another `test()`. |
| `taqwright: command not found` / wrong Node | `nvm use 24`, then `npm install`. |
| `Unable to find an active device` | Boot an emulator; `npx taqwright devices`, or set `device.udid`. |
| APK not found at `buildPath` | Ensure [`../app/DemoApp-v1.0.0.apk`](../app/) exists (committed). |
