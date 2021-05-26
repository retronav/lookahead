/**
 * High level function to emit a custom event with detail.
 */
export function emitCustomEvent<T>(
  name: string,
  detail?: T,
  source?: HTMLElement | Window | Document,
) {
  const event = new CustomEvent(name, { detail });
  try {
    if (source) {
      source.dispatchEvent(event);
      return true;
    } else {
      window.dispatchEvent(event);
      return true;
    }
  } catch {
    return false;
  }
}
