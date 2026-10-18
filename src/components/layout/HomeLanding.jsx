"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";
import { navState } from "@/lib/transition";
import { SECTION_IDS, scrollState, scrollToSection } from "@/lib/sections";

/**
 * Deep links: loading "/#speakers" (shared link or refresh) lands on that section once the
 * intro has finished and fonts have settled. Client navigations with a hash (from /sponsors)
 * are handled by PageTransition instead.
 */
export default function HomeLanding() {
  useEffect(() => {
    if (navState.clientNavigated) return;
    const id = window.location.hash.slice(1);
    if (!SECTION_IDS.includes(id) || id === "home") return;

    scrollState.busy = true; // keep scroll-spy from rewriting the hash before we land
    let cancelled = false;
    const unsubscribe = onIntroDone(() => {
      (document.fonts?.ready ?? Promise.resolve()).then(() => {
        if (cancelled) return;
        ScrollTrigger.refresh();
        scrollToSection(id, { instant: true });
      });
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return null;
}
