"use client";

import { useEffect, useRef } from "react";

const SWIPE_MIN = 50;

/**
 * Keyboard (←/→ while the section is in view or focused) and horizontal swipe input
 * for the Speaker Reveal. `onStep(±1)` is read through a ref so listeners never go stale.
 * Returns touch handlers to spread on the section.
 */
export default function useRevealInput(rootRef, onStep) {
  const stepRef = useRef(onStep);
  const inView = useRef(false);
  const touch = useRef(null);

  useEffect(() => {
    stepRef.current = onStep;
  });

  useEffect(() => {
    const root = rootRef.current;
    const io = new IntersectionObserver(([entry]) => (inView.current = entry.isIntersecting), { threshold: 0.35 });
    io.observe(root);

    const onKey = (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
      if (!inView.current && !root.contains(document.activeElement)) return;
      if (root.closest("[inert]")) return; // e.g. mobile menu open
      if (event.target.closest?.("input, textarea, select, [contenteditable], [data-scroller]")) return;
      event.preventDefault();
      stepRef.current(event.key === "ArrowRight" ? 1 : -1);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [rootRef]);

  return {
    onTouchStart(event) {
      if (event.target.closest("[data-scroller]")) return; // let the cards row scroll natively
      const t = event.touches[0];
      touch.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd(event) {
      if (!touch.current) return;
      const t = event.changedTouches[0];
      const dx = t.clientX - touch.current.x;
      const dy = t.clientY - touch.current.y;
      touch.current = null;
      if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) stepRef.current(dx < 0 ? 1 : -1);
    },
  };
}
