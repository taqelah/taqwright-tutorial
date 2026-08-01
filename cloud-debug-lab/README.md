# Cloud Lab — same page-object spec, on BrowserStack ☁️

This lab **reuses the Page Object code** from [`../page-object-lab/`](../page-object-lab/) and runs
the exact same add-to-cart spec on a **real device in the cloud**. The whole point: the spec, the
page objects, and the `mobile` API are **unchanged** — only the project's `device.provider` flips
from `emulator` to `browserstack`.

```text
cloud-debug-lab/
├── taqwright.config.ts     3 projects: `android` (local) · `browserstack-android` · `browserstack-ios`
├── pages/                  the SAME page objects (base + Android/iOS subclasses + factory)
└── tests/
    └── add-to-cart.spec.ts the SAME platform-agnostic spec
```

## Run

```bash
cd cloud-debug-lab
nvm use 24
npm install

# creds: copy the template and fill in your BrowserStack username / access key
cp .env.example .env        # then edit .env  (it's gitignored)

npm run test:local                                # local emulator
npm run test:cloud-android                        # BrowserStack — real Android device
npm run test:cloud-ios                            # BrowserStack — real iOS device
npx taqwright show-report
```

> Creds load from **`.env`** via `dotenv` (or your shell env). The cloud apps are **pre-uploaded**
> to BrowserStack (`bs://…` ids in the config) — no per-run upload. Override with `TAQ_APK` / `TAQ_IPA`.

## What changed for the cloud (only the project's `use`)

| Local `android` | Cloud `browserstack-android` |
| --- | --- |
| `device: { provider: 'emulator', autoDiscover: true }` | `device: { provider: 'browserstack', name: 'Google Pixel 8', osVersion: '14.0' }` |
| local Appium (`appium.autoStart`) | **no** local `appium` block — BrowserStack runs the server |
| `buildPath: '../app/…apk'` (installed locally) | same `.apk` **uploaded** on run, or `TAQ_APK="bs://<id>"` |
| serial (1 device) | `workers: 5` — one cloud device per session (**no** `device.pool`) |

- 🔑 **Creds via env**, never in the config: `BROWSERSTACK_USERNAME` / `BROWSERSTACK_ACCESS_KEY`.
- ⚙️ Vendor knobs through `capabilities → 'bstack:options'` (here: `appiumVersion`, `idleTimeout`);
  `appium.connectionTimeout` is raised for slow parallel allocation.
- The `pages/` already include an `IosAddToCartPage` — add a `browserstack-ios` project (with the iOS
  `.app`/`.ipa` and `appBundleId: 'com.taqelah.demoApp'`) and the same spec runs there too.

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `BROWSERSTACK_USERNAME` not set | Export both `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`. |
| Upload is slow every run | Pre-upload once and set `TAQ_APK="bs://<app-id>"`. |
| local `android` can't find a device | Boot an emulator; `npx taqwright devices`. |
| A locator isn't found | Fix it in the page-object subclass (`pages/`), never in the spec. |
