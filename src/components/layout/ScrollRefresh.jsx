"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/motion";

/**
 * Keeps ScrollTrigger positions right on the long page: one refresh once fonts and the page's
 * images have loaded, then a debounced one when lazy content (the map iframe, lazy images)
 * finishes loading later. Also pauses CSS loops inside [data-loops] areas that are off-screen.
 */
export default function ScrollRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const refresh = () => !cancelled && ScrollTrigger.refresh();
    const later = (event) => {
      if (!/^(IFRAME|IMG)$/.test(event.target?.tagName)) return;
      clearTimeout(timer);
      timer = setTimeout(refresh, 250);
    };

    const loaded = document.readyState === "complete" ? Promise.resolve() : new Promise((r) => window.addEventListener("load", r, { once: true }));
    Promise.all([document.fonts?.ready, loaded]).then(refresh);
    // load events don't bubble, but they can be captured on the document.
    document.addEventListener("load", later, true);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("load", later, true);
    };
  }, []);

  useEffect(() => {
    const areas = document.querySelectorAll("[data-loops]");
    const io = new IntersectionObserver((entries) =>
      entries.forEach((entry) => entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting))
    );
    areas.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
