# Parallel Lab — run wide across devices ⚡

A focused mini-project for **§9 · Parallelism**, adapted from the official
[taqwright-demo config](https://github.com/Taqwright/taqwright-demo/blob/main/taqwright.config.ts).
The `taqwright.config.ts` is the lesson: **4 local-Android projects**, each a different parallelism
strategy against the same demo-app. Run one at a time with `--project <name>`.

```text
parallel-lab/
├── taqwright.config.ts     ← the star: 4 projects (single · pool · auto 1-wide · auto 2-wide)
└── tests/
    └── android/            smoke.spec.ts + login.spec.ts (3 tests → workers can fan out)
```

## The 4 projects

| Project | Strategy | Run | Runs where |
| --- | --- | --- | --- |
| `android-single` | one pinned emulator (`udid`) | `npx taqwright test --project android-single` | needs that AVD/serial |
| `android-pool-2` | fixed `pool` of 2, `workers: 2` | `… --project android-pool-2` | needs the 2 named AVDs |
| **`android-auto-1`** | `autoDiscover`, serial | `… --project android-auto-1` | **anywhere (1 AVD)** |
| **`android-auto-2`** | `autoDiscover`, `workers: 2` | `… --project android-auto-2` | **anywhere (≥2 AVDs)** |

**Start here** (run-anywhere): `android-auto-1` (serial baseline) → `android-auto-2` (2-wide).

## Run

```bash
cd parallel-lab
nvm use 24
npm install

npm run test:auto1     # = --project android-auto-1   (serial, 1 device)
npm run test:auto2     # = --project android-auto-2   (2-wide, needs 2 booted AVDs)
npx taqwright show-report
```

## What to watch

- With `workers: 2` you should see **two emulators** driven at once, each with its **own Appium**
  on a staggered port — **worker 0 → `:4723`, worker 1 → `:4724`** (`4723 + i`, automatic).
- `fullyParallel: true` lets the 3 android tests spread across the 2 workers (not just whole files).
- A project's `workers` must be **≤ its device count** — `android-auto-2` needs **≥ 2 booted AVDs**,
  else it can't fan out.

## Knobs & env

- `TAQ_APK=/path/to/App.apk` overrides the Android `buildPath` (default: the committed
  [`../app/DemoApp-v1.0.0.apk`](../app/)).

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `workers must be <= device count` | Boot more AVDs, or lower `workers` (use `android-auto-1`). |
| 2-wide only uses one device | Only one AVD is booted — start a second (`emulator -avd <name>`). |
| `android-single` / `pool-2` can't find the AVD | Those pin specific AVD names/serials — edit them to match `npx taqwright devices`, or use the `auto` projects. |
