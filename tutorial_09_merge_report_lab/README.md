# Merge Report Lab — shard → blob → one report 🧬

A focused mini-project for **§15 · Reporters** (the merge story). When you split a suite across
machines with **sharding**, each shard produces a **`blob`** archive — a machine-readable report
fragment. **`merge-reports`** stitches all the blobs back into **one** HTML report.

This lab is **complete and runnable** (needs a booted Android emulator).

```text
tutorial_09_merge_report_lab/
├── taqwright.config.ts     android baseline; reporter = list + html
└── tests/
    ├── login.spec.ts       file split to shard 1/2
    └── smoke.spec.ts       file split to shard 2/2
```

## The flow

```bash
cd tutorial_09_merge_report_lab
nvm use 24
npm install

npm run shard1     # --shard 1/2 --reporter blob → blob-report/report-1.zip → moved to all-blobs/
npm run shard2     # --shard 2/2 --reporter blob → blob-report/report-2.zip → moved to all-blobs/
npm run merge      # taqwright merge-reports all-blobs --reporter html  → ONE combined report
npm run report     # taqwright show-report
```

- The **`blob`** reporter is passed on the **CLI** (`--reporter blob`), not in the config — so the
  same suite runs human-readable locally and shardable in CI.
- Sharding splits at **file** level (`fullyParallel: true` → test level). Two spec files → one per shard.
- ⚠️ The blob reporter **clears `blob-report/` at the start of every run**, so two shards on **one
  machine** would overwrite each other. Each `shardN` script therefore **moves** its blob into
  `all-blobs/` before the next shard runs; `merge` reads `all-blobs/`. (`npm run clean` resets all
  three dirs.)

## In CI (the real use)

Each shard runs on its **own machine** (a GitHub Actions **matrix** of N jobs) — so there's no
clobber and no `mv` needed; you just gather the per-machine artifacts before merging:

```yaml
strategy: { matrix: { shard: [1, 2, 3, 4] } }
# job: npx taqwright test --shard ${{ matrix.shard }}/4 --reporter blob
#      → upload blob-report/ as an artifact (one per machine)
# then a separate "merge" job:
#      download ALL blob-report artifacts into ./all-blobs
#      npx taqwright merge-reports ./all-blobs --reporter html
```

One green/red HTML report for the whole run, instead of N partial ones.

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `merge-reports` finds no blobs | Run `shard1`/`shard2` first; they move blobs into `all-blobs/`. |
| Only one shard's tests in the report | The blob reporter wiped `blob-report/` between shards — that's why each `shardN` script `mv`s its blob into `all-blobs/` first. Run `npm run clean` and re-run both shards. |
| `Unable to find an active device` | Boot an emulator; `npx taqwright devices`. |
| APK not found at `buildPath` | Ensure [`../app/DemoApp-v1.0.0.apk`](../app/) exists (committed). |
