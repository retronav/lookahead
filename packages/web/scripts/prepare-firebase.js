const { initializeApp } = require('firebase/app/dist/index.cjs');
const {
  getAuth,
  useAuthEmulator,
  createUserWithEmailAndPassword,
} = require('firebase/auth/dist/index.cjs');
const {
  getFirestore,
  useFirestoreEmulator,
  collection,
  doc,
  writeBatch,
} = require('firebase/firestore/dist/index.cjs');

const app = initializeApp({
  apiKey: 'fake-api-key',
  projectId: 'lookahead-89164',
  authDomain: 'somedomain',
  databaseURL: 'somedomain',
  storageBucket: 'somedomain',
});

const auth = getAuth(app);
const db = getFirestore(app);

useAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
useFirestoreEmulator(db, 'localhost', 8000);

// Utility functions
const success = (...things) => {
  console.log(...things);
  process.exit(0);
};
const fail = (...things) => {
  console.error(...things);
  process.exit(1);
};

const dataArr = [
  {
    title: 'Title',
    content: 'Content',
    last_edited: new Date().toISOString(),
  },
  {
    title: 'Multiline',
    content: 'Multi\nline',
    last_edited: new Date().toISOString(),
  },
];

(async () => {
  try {
    // Create user
    const creds = await createUserWithEmailAndPassword(
      auth,
      'clark@lookahead.web.app',
      'l00kahead',
    );
    console.log('Created test user');
    const colRef = collection(db, `users/${creds.user.uid}/todos`);
    const batch = writeBatch(db);
    dataArr.map((data) => {
      const docRef = doc(colRef);
      batch.set(docRef, data);
      console.log(`Created doc : ${docRef.path}`);
    });
    await batch.commit();
    success('Done setting up. You can now start testing :)');
  } catch (error) {
    fail(`Something went wrong. Error: ${error}`);
  }
})();
