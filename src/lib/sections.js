"use client";

import { gsap, prefersReducedMotion } from "./motion";

/** Sections of the homepage scroll, in page order. Navbar hrefs are "/#<id>". */
export const SECTION_IDS = ["home", "speakers", "schedule", "team"];

/** Separate pages (outside the homepage scroll); navigating to or from them uses the page wipe. */
export const PAGE_PATHS = ["/about", "/sponsors", "/contact"];
export const isSeparatePage = (pathname) => PAGE_PATHS.some((p) => pathname.startsWith(p));

/** In-page target of a link: "/#speakers" → "speakers", "/" → "home"; other pages (e.g. "/about/") → null. */
export function sectionFromHref(href) {
  if (href === "/") return "home";
  const match = /^\/?#([\w-]+)$/.exec(href);
  return match ? match[1] : null;
}

export const isHomePath = (pathname) => pathname === "/" || pathname === "";

/**
 * Shared scroll state. `busy` is true during programmatic scrolls and the deep-link landing,
 * so scroll-spy doesn't rewrite the hash (or hide the navbar) while we move the page.
 */
export const scrollState = { busy: false };

const navOffset = () => document.querySelector("header")?.offsetHeight ?? 72;

// Document position from layout (offsetTop), unaffected by transforms such as the page fade-in lift.
function layoutTop(el) {
  let top = 0;
  for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
  return top;
}

export function setHash(id) {
  const hash = `#${id}`;
  if (window.location.hash === hash) return;
  // Keep Next's router state; replaceState adds no history entry and doesn't jump.
  window.history.replaceState(window.history.state, "", hash);
}

/**
 * Scrolls to a section, offset by the navbar height. Smooth (GSAP ScrollToPlugin) unless
 * `instant` or reduced motion. Wheel/touch input interrupts it: the page is never hijacked.
 * Moves focus to the section afterwards so keyboard users continue from there.
 */
export function scrollToSection(id, { instant = false, focus = true } = {}) {
  const target = document.getElementById(id);
  if (!target) return;
  scrollState.busy = true;
  document.documentElement.dataset.autoScroll = "";

  const finish = () => {
    scrollState.busy = false;
    // Cleared after the resulting scroll events, so the navbar doesn't read the jump as "scrolling down".
    setTimeout(() => delete document.documentElement.dataset.autoScroll, 150);
    setHash(id);
    if (focus) target.focus({ preventScroll: true });
  };

  gsap.killTweensOf(window);
  const y = Math.max(0, layoutTop(target) - navOffset());
  if (instant || prefersReducedMotion()) {
    window.scrollTo(0, y);
    finish();
    return;
  }
  // Fast and fluid: duration scales with distance (≈0.35s nearby, at most 0.75s for the longest jump).
  const distance = Math.abs(y - window.scrollY);
  gsap.to(window, {
    duration: Math.min(0.75, 0.3 + distance / 6000),
    ease: "power2.inOut",
    scrollTo: { y: target, offsetY: navOffset(), autoKill: true },
    onComplete: finish,
    onInterrupt: finish,
  });
}
