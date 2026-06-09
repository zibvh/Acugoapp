import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bixcart.app',
  appName: 'Bixcart',
  webDir: 'frontend',
  plugins: {
    PushNotifications: { presentationOptions: ['badge', 'sound', 'alert'] },
    StatusBar: { style: 'LIGHT', backgroundColor: '#ffffff' },
    SplashScreen: { launchShowDuration: 0, launchAutoHide: true, backgroundColor: '#ffffff', showSpinner: false },
  },
  android: { allowMixedContent: false, captureInput: true, webContentsDebuggingEnabled: false, initialFocus: true },
  ios: { contentInset: 'always', scrollEnabled: true },
};

export default config;
