import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import app from './config'

// In dev: set self.FIREBASE_APPCHECK_DEBUG_TOKEN = true in the browser console
// to get a debug token you can whitelist in the Firebase console.
if (import.meta.env.DEV) {
  // @ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = '7418be43-6351-44b1-9d87-af6a994ce4d9'
}

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_FIREBASE_APPCHECK_KEY),
  isTokenAutoRefreshEnabled: true,
})
