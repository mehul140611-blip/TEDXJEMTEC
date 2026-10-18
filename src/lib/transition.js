"use client";

import { createContext } from "react";

/**
 * Provided by PageTransition. `start(href)` returns true when it takes over the
 * navigation (wipe in, then router.push). Without a provider, links navigate normally.
 */
export const TransitionContext = createContext(null);

/**
 * Set once the first client-side navigation happens, so template.jsx animates page
 * content in on route changes but never on the initial (already painted) load.
 */
export const navState = { clientNavigated: false };

export function markClientNavigation() {
  navState.clientNavigated = true;
}

export function samePath(a, b) {
  const clean = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
  return clean(a) === clean(b);
}
