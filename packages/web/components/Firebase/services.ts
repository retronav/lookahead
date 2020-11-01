import firebase from "firebase/app";
import "firebase/auth";
import { NextRouter } from "next/router";
import React from "react";
import isBrowser from "../util/isBrowser";
import firebaseConfig from "./firebaseConfig";

if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);

// Ignore the item if user already signed in or set it to false
typeof window !== "undefined" && window.localStorage.getItem("isSignedIn")
  ? {}
  : typeof window !== "undefined" &&
    window.localStorage.setItem("isSignedIn", "false");

export const auth = firebase.auth();
export const firestore = import("firebase/firestore") as Promise<
  firebase.firestore.Firestore
>;

export const useIsSignedIn = () => {
  const [isSignedIn, setIsSignedIn] = React.useState(
    isBrowser() ? window.localStorage.getItem("isSignedIn") : ""
  );
  const setSignedIn = (value: boolean) => {
    isBrowser() && window.localStorage.setItem("isSignedIn", value.toString());
    setIsSignedIn(value.toString());
  };
  return { isSignedIn, setSignedIn };
};

export const authServices = () => {
  const [user, setUser] = React.useState<firebase.User | null>(
    auth.currentUser
  );
  const useAuth = () => {
    return user;
  };
  const { setSignedIn } = useIsSignedIn();
  const signInWithGoogle = async (openSnackBar: Function) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      await auth.signInWithPopup(provider);
      setSignedIn(true);
      if (auth.currentUser) setUser(auth.currentUser);
      if (isBrowser()) window.location.pathname = "/app";
    } catch (e) {
      openSnackBar(e.message || e);
      throw e;
    }
  };
  const sendSignInLinkToEmail = async (
    email: string,
    openSnackBar: Function
  ) => {
    try {
      await auth.sendSignInLinkToEmail(email, {
        url: `${window.location.origin}/signin`,
        handleCodeInApp: true,
      });
      window.localStorage.setItem("email", email);
      setSignedIn(true);
      openSnackBar(
        "We have sent a link on your email. Click the link to sign in."
      );
    } catch (e) {
      openSnackBar(e.message || e);
      throw e;
    }
  };

  const signInWithEmailLink = async () => {
    const email =
      window.localStorage.getItem("email") ||
      prompt("Please enter your email to confirm") ||
      "";
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    await auth.signInWithEmailLink(email, window.location.href);
    if (window.localStorage.getItem("email"))
      window.localStorage.removeItem("email");
    if (auth.currentUser && auth.currentUser.displayName) {
      return "oldUser";
    } else return "newUser";
  };

  const finalizeEmailSignIn = async (
    displayName: string,
    history: NextRouter,
    openSnackBar: Function
  ) => {
    try {
      if (auth.currentUser)
        await auth.currentUser.updateProfile({ displayName: displayName });
      if (window.localStorage.getItem("email"))
        window.localStorage.removeItem("email");
      history.push("/");
    } catch (e) {
      openSnackBar(e.message || e);
      throw e;
    }
  };

  const signOut = async (history: NextRouter) => {
    try {
      setSignedIn(false);
      await auth.signOut();
      history.push("/");
      window.location.reload();
    } catch (e) {
      throw e;
    }
  };
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  return {
    useAuth,
    signInWithGoogle,
    signInWithEmailLink,
    sendSignInLinkToEmail,
    finalizeEmailSignIn,
    signOut,
  };
};
