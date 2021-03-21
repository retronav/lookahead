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

const config = import.meta.env.SNOWPACK_PUBLIC_FIREBASE_APP_CONFIG
  ? //CI
    JSON.parse(window.atob(import.meta.env.SNOWPACK_PUBLIC_FIREBASE_APP_CONFIG))
  : //LOCAL
    {
      apiKey: import.meta.env.SNOWPACK_PUBLIC_APIKEY,
      authDomain: import.meta.env.SNOWPACK_PUBLIC_AUTHDOMAIN,
      databaseURL: import.meta.env.SNOWPACK_PUBLIC_DATABASEURL,
      projectId: import.meta.env.SNOWPACK_PUBLIC_PROJECTID,
      storageBucket: import.meta.env.SNOWPACK_PUBLIC_STORAGEBUCKET,
      messagingSenderId: import.meta.env.SNOWPACK_PUBLIC_MESSAGINGSENDERID,
      appId: import.meta.env.SNOWPACK_PUBLIC_APPID,
      measurementId: import.meta.env.SNOWPACK_PUBLIC_MEASUREMENTID,
    };

const firebaseApp = !getApps().length ? initializeApp(config) : getApp();

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

if (import.meta.env.NODE_ENV !== 'production') {
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
