import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  indexedDBLocalPersistence,
  useAuthEmulator,
} from 'firebase/auth';
import {
  enableMultiTabIndexedDbPersistence,
  getFirestore,
  useFirestoreEmulator,
} from 'firebase/firestore';
import { AppEvents, OpenSnackBarEventDetails } from '../events/events';
import { emitCustomEvent } from '../events';

const config = import.meta.env.VITE_FIREBASE_APP_CONFIG
  ? //CI
    JSON.parse(window.atob(import.meta.env.VITE_FIREBASE_APP_CONFIG))
  : //LOCAL
    {
      apiKey: import.meta.env.VITE_APIKEY,
      authDomain: import.meta.env.VITE_AUTHDOMAIN,
      databaseURL: import.meta.env.VITE_DATABASEURL,
      projectId: import.meta.env.VITE_PROJECTID,
      storageBucket: import.meta.env.VITE_STORAGEBUCKET,
      messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
      appId: import.meta.env.VITE_APPID,
      measurementId: import.meta.env.VITE_MEASUREMENTID,
    };

const firebaseApp = !getApps().length ? initializeApp(config) : getApp();

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

if (import.meta.env.MODE !== 'production') {
  useAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  useFirestoreEmulator(db, 'localhost', 8000);
}

enableMultiTabIndexedDbPersistence(db).catch((error: any) => {
  let helperText = '';
  switch (error.code) {
    case 'failed-precondition':
      helperText = 'Please close all tabs of this app and reload the page.';
    case 'unimplemented':
      helperText = 'Your browser does not support offline mode.';
    default:
      helperText = 'There was a problem while starting offline mode.';
  }
  emitCustomEvent<OpenSnackBarEventDetails>(AppEvents.OPEN_SNACKBAR, {
    label: helperText,
    buttons: { action: { enabled: false }, enableDismiss: false },
  });
});
setPersistence(auth, indexedDBLocalPersistence);

export { auth, db };
