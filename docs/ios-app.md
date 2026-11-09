# SnowFans iOS App

Capacitor 8 shell (`ios/`) that loads https://snowfans.org and adds native features.

## Build & upload (macOS + Xcode)

```bash
npm ci
npx cap sync ios
npx cap open ios        # opens ios/App/App.xcodeproj
```

In Xcode: select the **App** target → Signing & Capabilities → choose your Team, then Product → Archive → Distribute App → App Store Connect.

Bump `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` for each upload.

## Native behaviour (`src/lib/native.ts`, `src/components/pwa/NativeBridge.tsx`)

- Google / Apple OAuth open in the system browser sheet (Google blocks WebView sign-in) and return via
  `com.snowfansorg.snowfans://auth/callback`, which is forwarded to `/auth/callback` inside the WebView.
- Native share sheet for profile links, haptics on bottom-nav taps, native splash and status bar.
- Offline fallback page: `cap-shell/index.html`.

## Required backend config

- Supabase → Authentication → URL Configuration → Redirect URLs: add `com.snowfansorg.snowfans://auth/callback`.
- Supabase → Authentication → Providers → Apple: enabled, with the Services ID / key from the Apple Developer account.
- Coolify env: `SUPABASE_SERVICE_ROLE_KEY` must be set, otherwise account deletion leaves the auth user behind.

## Icons

`assets/icon.svg` → `assets/icon-only.png` (1024, no alpha) → `npx @capacitor/assets generate --ios`.
