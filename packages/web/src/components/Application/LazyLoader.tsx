import React from "react";
const mode = window.localStorage.getItem("themeName");
export default () => (
  <video
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      ...(mode === "dark" ? { filter: "invert(0.795) brightness(1.25)" } : {}),
    }}
    loop
    autoPlay
    muted
    src="/loader.webm"
  />
);
