import React from "react";
import isBrowser from "../util/isBrowser";
const mode = isBrowser() && window.localStorage.getItem("themeName");

const LazyLoader = () => (
  <video
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      ...(mode === "dark" ? { filter: "invert(1)" } : {}),
    }}
    loop
    autoPlay
    muted
    src="/loader.webm"
  />
);

export default LazyLoader;
