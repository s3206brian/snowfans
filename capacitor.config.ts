import type { CapacitorConfig } from '@capacitor/cli'

/**
 * SnowFans iOS shell.
 *
 * The app loads the production site (server.url) so web and app stay in sync,
 * and falls back to the bundled offline page in `cap-shell/` when the network
 * is unavailable. Native plugins (Browser, Share, Haptics, StatusBar…) are
 * injected into the remote page by Capacitor; web code reaches them through
 * `src/lib/native.ts`, which no-ops in a normal browser.
 */
const config: CapacitorConfig = {
  appId: 'org.snowfans.app',
  appName: 'SnowFans',
  webDir: 'cap-shell',
  server: {
    url: 'https://snowfans.org/explore',
    errorPath: 'index.html',
    allowNavigation: ['snowfans.org', 'www.snowfans.org', '*.supabase.co'],
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#020617',
    scheme: 'SnowFans',
    limitsNavigationsToAppBoundDomains: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#020617',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#020617',
      overlaysWebView: false,
    },
  },
}

export default config
