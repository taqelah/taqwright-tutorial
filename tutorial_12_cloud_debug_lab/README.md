# Cloud Lab — same page-object spec, on BrowserStack ☁️

This lab takes **[`../tutorial_11_page_object_lab/`](../tutorial_11_page_object_lab/)'s page objects and spec verbatim** and runs them on a
**real device in the cloud**. That's the whole lesson: the spec, the page objects, and the `mobile`
API don't change at all — only the project's `device.provider` flips from `emulator` to
`browserstack`.

> ℹ️ **Copied, not imported.** Each lab is a standalone npm project, so `pages/` and
> `tests/add-to-cart.spec.ts` are byte-for-byte copies of lab 11's — **except one line** in
> [`pages/index.ts`](pages/index.ts): this lab's projects are named `browserstack-ios` /
> `browserstack-android`, so the factories test `projectName.includes('ios')` where lab 11 tests
> `=== 'ios'`. Diff the two folders and that's all you'll find.

```text
tutorial_12_cloud_debug_lab/
├── taqwright.config.ts        3 projects: `android` (local) · `browserstack-android` · `browserstack-ios`
├── pages/                     one page object per SCREEN — same as lab 11
│   ├── login/                 LoginPage        + AndroidLoginPage / IosLoginPage
│   ├── home/                  HomePage         + Android/Ios subclasses
│   ├── search-catalogue/      SearchCataloguePage + Android/Ios subclasses
│   ├── cart/                  CartPage         + Android/Ios subclasses
│   └── index.ts               one factory per screen (the only file that differs from lab 11)
└── tests/
    └── add-to-cart.spec.ts    the fluent chain — identical on local & cloud, Android & iOS
```

## Run

```bash
cd tutorial_12_cloud_debug_lab
nvm use 24
npm install

# creds: copy the template and fill in your BrowserStack username / access key
cp .env.example .env        # then edit .env  (it's gitignored)

npm run test:local                                # local emulator
npm run test:cloud-android                        # BrowserStack — real Android device
npm run test:cloud-ios                            # BrowserStack — real iOS device
npx taqwright show-report
```

> Creds load from **`.env`** via `dotenv` (or your shell env).

### ⚠️ The `bs://…` app ids in the config are **not yours**

`taqwright.config.ts` ships with two hardcoded `bs://…` ids. **They belong to the author's
BrowserStack account** — a `bs://` id is private to the account that uploaded it, so running the
cloud projects as-is fails with *App not found* / 403. Supply your own app one of two ways:

**(a) Upload once, reuse the id** — fastest per run:

```bash
curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
  -X POST https://api-cloud.browserstack.com/app-automate/upload \
  -F "file=@../app/DemoApp-v1.0.0.apk"
# → {"app_url":"bs://<your-id>"}
```

Put the returned id in `.env` as `TAQ_APK` (repeat with `../app/DemoApp-v1.1.0-debug-ios.app.zip`
for `TAQ_IPA`), or paste it straight into the config.

**(b) Skip the upload step** — point at the local binary and let taqwright upload it each run:

```bash
TAQ_APK=../app/DemoApp-v1.0.0.apk npm run test:cloud-android
```

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
- The `pages/` already include the `Ios*` subclass for every screen, so the `browserstack-ios`
  project (iOS `.app`/`.ipa` + `appBundleId: 'com.taqelah.demoApp'`) runs the same spec unchanged.

## 🆘 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `BROWSERSTACK_USERNAME` not set | Export both `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`. |
| `App not found` / 403 on a cloud run | You're using the config's built-in `bs://…` id, which is the author's. Upload your own app and set `TAQ_APK` / `TAQ_IPA` (see above). |
| Upload is slow every run | Pre-upload once and set `TAQ_APK="bs://<app-id>"`. |
| local `android` can't find a device | Boot an emulator; `npx taqwright devices`. |
| A locator isn't found | Fix it in the page-object subclass (`pages/`), never in the spec. |
