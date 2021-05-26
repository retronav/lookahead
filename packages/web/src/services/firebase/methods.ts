import {
  ActionCodeSettings,
  indexedDBLocalPersistence,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink as SDKsignInWithEmailLink,
  User,
} from 'firebase/auth';
import { auth } from './index';

/**
 * Namespace containing methods to work with Firebase Auth.
 */
export namespace AuthMethods {
  export const sendSignInLinkEmail = async (email: string) => {
    const actionCodeSettings: ActionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('signInEmail', email);
    } catch (error) {
      console.error(error.code, error.message);
    }
  };

  export const signInWithEmailLink = async (): Promise<User | undefined> => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = localStorage.getItem('signInEmail');
      if (!email) prompt('Please enter your email for confirmation');
      try {
        localStorage.removeItem('signInEmail');
        await auth.setPersistence(indexedDBLocalPersistence);
        //email can be safely type casted to string here
        const userCredential = await SDKsignInWithEmailLink(
          auth,
          email as string,
          window.location.href,
        );
        return userCredential.user;
      } catch (error) {
        console.error(error.code, error.message);
      }
    }
  };

  export const getCurrentUser = (): Promise<User | null> => {
    return new Promise((resolve, reject) => {
      if (auth.currentUser) {
        resolve(auth.currentUser);
      }
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  };
}
