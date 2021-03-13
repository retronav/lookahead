import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  indexedDBLocalPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
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

setPersistence(auth, indexedDBLocalPersistence);

export { auth, db };
