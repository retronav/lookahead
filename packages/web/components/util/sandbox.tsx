import React from "react";
/**
 * This function exists because conditional rendering (like rendering the
 * snackbar in the SWWrapper) might return some values and to stop
 * rendering those values, the whole thing is wrapped in this
 * @param fn Wrap the thing in a functions
 */
export function sandbox(fn: Function) {
  fn();
  return <></>;
}
