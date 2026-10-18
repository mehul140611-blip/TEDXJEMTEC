/**
 * Intro gate state, shared by the <head> script, IntroGate and the hero entrance.
 * `data-intro` on <html>: "play" (overlay visible, scroll locked), "skip" or "done".
 */

export const INTRO_SEEN_KEY = "tedxjemtec-intro-seen";
export const INTRO_START_TIMEOUT = 2500;
export const INTRO_HARD_CAP = 6000;
export const INTRO_FADE = 0.7;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
// Phones (touch screen, narrow in portrait or short in landscape) skip the intro video entirely.
// Tablets, laptops and desktops still play it.
const PHONE_QUERY = "(pointer: coarse) and (max-width: 767px), (pointer: coarse) and (max-height: 500px)";

// Runs in <head> before first paint. Anything unexpected falls back to "skip".
// `data-motion="ok"` lets CSS hide entrance elements from first paint (no flash before they animate in).
export const introHeadScript = `(function(){var d=document.documentElement,m="play",r=false;try{r=matchMedia(${JSON.stringify(
  REDUCED_QUERY
)}).matches;if(r||matchMedia(${JSON.stringify(PHONE_QUERY)}).matches||sessionStorage.getItem(${JSON.stringify(
  INTRO_SEEN_KEY
)}))m="skip"}catch(e){m="skip"}d.dataset.intro=m;d.dataset.motion=r?"reduce":"ok"})()`;

export function readMotionMode() {
  return window.matchMedia(REDUCED_QUERY).matches ? "reduce" : "ok";
}

export function readIntroMode() {
  try {
    if (
      sessionStorage.getItem(INTRO_SEEN_KEY) ||
      window.matchMedia(REDUCED_QUERY).matches ||
      window.matchMedia(PHONE_QUERY).matches
    )
      return "skip";
    return "play";
  } catch {
    return "skip";
  }
}

let state = "pending"; // "pending" | "playing" | "done"
const listeners = new Set();

export function setIntroPlaying() {
  state = "playing";
}

export function markIntroDone() {
  state = "done";
  listeners.forEach((fn) => fn());
  listeners.clear();
}

/** Runs `fn` once the intro overlay is gone (immediately if it was skipped). Returns an unsubscribe. */
export function onIntroDone(fn) {
  const mode = typeof document === "undefined" ? undefined : document.documentElement.dataset.intro;
  if (state === "done" || (state === "pending" && mode !== "play")) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
