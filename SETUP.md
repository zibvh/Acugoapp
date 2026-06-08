# Bixcart — Capacitor Native App Setup

## Quick start (Termux / Linux)

```bash
# 1. Install deps
npm install

# 2. Add native platforms (first time only — commits android/ and ios/ to git)
npx cap add android
npx cap add ios

# 3. Sync web assets into native folders
npx cap sync
```

That's it. Push to `main` and GitHub Actions will build the APK automatically.

---

## GitHub Actions — one required secret

Go to: **Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|-------|
| `BIXCART_API_URL` | Your deployed backend, e.g. `https://campusmarket.onrender.com` |

On every push to `main`:
- **Android job** → builds a debug APK, available under Actions → Artifacts
- **iOS job** → builds a simulator binary (no Apple account needed)

---

## Download the APK

1. GitHub repo → **Actions** tab
2. Click latest "Build Android APK" run
3. Scroll to **Artifacts** → download `bixcart-debug-<sha>.apk`
4. On your Android phone: enable "Install from unknown sources", open the APK

---

## Signed release APK (Play Store)

Generate a keystore once:
```bash
keytool -genkey -v -keystore bixcart.jks -alias bixcart \
  -keyalg RSA -keysize 2048 -validity 10000
```

Base64-encode it:
```bash
base64 bixcart.jks   # Linux/Termux
```

Add these secrets to GitHub:

| Secret | Value |
|--------|-------|
| `KEYSTORE_BASE64` | Output of the base64 command |
| `KEYSTORE_PASSWORD` | Your keystore password |
| `KEY_ALIAS` | `bixcart` |
| `KEY_PASSWORD` | Your key password |

Then uncomment the `build-android-release` job in `.github/workflows/android.yml`.

---

## Default page

`frontend/index.html` is now the marketplace (was the landing page).
All nav logo links point to `/pages/marketplace.html`.
The old `frontend/pages/marketplace.html` still works too.

---

## Troubleshooting

**API calls fail on device** → Make sure `BIXCART_API_URL` is set and your backend is on HTTPS.

**White screen on launch** → `server.url` in `capacitor.config.ts` must match your live backend.

**`npx cap sync` error** → Run from the project root where `capacitor.config.ts` lives.

**Inspect on Android** → Enable USB debugging, open `chrome://inspect` on desktop Chrome.
