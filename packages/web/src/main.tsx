import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import firebase from "firebase/app";

const rootElement = document.getElementById("root");

if (rootElement && rootElement.hasChildNodes()) {
  ReactDOM.hydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    rootElement
  );
} else {
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    rootElement as HTMLElement
  );
}
import("firebase/performance").then(() => {
  if (
    process.env.NODE_ENV === "production" &&
    navigator.userAgent !== "ReactSnap"
  )
    firebase.performance();
});
import("firebase/analytics").then(() => {
  if (
    process.env.NODE_ENV === "production" &&
    navigator.userAgent !== "ReactSnap"
  )
    firebase.analytics();
});
