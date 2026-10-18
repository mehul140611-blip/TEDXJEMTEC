"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS, scrollState, setHash } from "./sections";

/** Desktop navigation needs ~1100px to fit the logo, 7 links and the Register pill. */
export const DESKTOP_NAV_QUERY = "(min-width: 1100px)";

/**
 * Scroll-spy for the single page: the active section is the one crossing 40% of the viewport.
 * Also mirrors it into the URL hash (replaceState: no history entries, no jump), except during
 * the intro and programmatic scrolls.
 */
export function useActiveSection(enabled) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (!hit) return;
        setActive(hit.target.id);
        const introPlaying = document.documentElement.dataset.intro === "play";
        if (!scrollState.busy && !introPlaying) setHash(hit.target.id);
      },
      { rootMargin: "-40% 0px -59% 0px" }
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

/** Whether a nav item is current: its section on "/", or the Sponsors page itself. */
export function navCurrent(item, { onHome, activeSection, pathname }) {
  if (item.section) return onHome && activeSection === item.section ? "true" : undefined;
  return pathname.startsWith(item.href.replace(/\/$/, "")) ? "page" : undefined;
}
