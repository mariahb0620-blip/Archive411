import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Native shell config for iOS/Android (Capacitor).
 *
 * Next.js requires a running server — set CAPACITOR_SERVER_URL to your deployed
 * URL (e.g. https://archive411.studio) or local LAN IP for dev:
 *   CAPACITOR_SERVER_URL=http://192.168.1.x:3000 npm run cap:sync
 */
const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: "studio.archive411.app",
  appName: "ARCHIVE411",
  webDir: "public",
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: serverUrl.startsWith("http://"),
        androidScheme: "https",
      }
    : undefined,
  ios: {
    contentInset: "automatic",
    scrollEnabled: true,
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0a0a0a",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
  },
};

export default config;
