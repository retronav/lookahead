import firebase from "firebase/app";
import { isLocalhost } from "../registerSW";
import isBrowser from "./isBrowser";
if (process.env.NODE_ENV === "production" && !isLocalhost && isBrowser()) {
  import("firebase/analytics").then(() => {
    firebase.analytics();
  });
  import("firebase/performance").then(() => {
    firebase.performance();
  });
}
