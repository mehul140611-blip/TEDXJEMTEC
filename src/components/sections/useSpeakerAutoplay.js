"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "@/lib/motion";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Auto-advance for the Speaker Reveal. One paused GSAP tween runs a 0→1 progress value over
 * `durationMs`; it fills the bar and calls `onAdvance()` at the end. Pausing/resuming that one
 * tween keeps the remaining time exactly. It runs only while nothing asks it to pause:
 *   user (pause button) · busy (a transition is running, or the first entrance hasn't happened)
 *   focus (keyboard focus inside) · offscreen (< 50% in view) · hidden (tab hidden).
 * Hovering does NOT pause it (the team wants it to keep moving while people watch with the
 * pointer over it); the pause button is the user's control (WCAG 2.2.2).
 * Reduced motion starts paused (the visitor can still press play).
 */
export default function useSpeakerAutoplay({ rootRef, barRef, durationMs, onAdvance }) {
  const reduce = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const [userChoice, setUserChoice] = useState(null); // null until the visitor presses the button
  const playing = userChoice ?? !reduce;

  const reasons = useRef(new Set(["busy", "offscreen"]));
  const tween = useRef(null);
  const advance = useRef(onAdvance);
  useEffect(() => {
    advance.current = onAdvance;
  });

  const api = useMemo(() => {
    const sync = () => {
      const t = tween.current;
      if (!t) return;
      if (reasons.current.size === 0) t.play();
      else t.pause();
    };
    const set = (reason, on) => {
      if (on) reasons.current.add(reason);
      else reasons.current.delete(reason);
      sync();
    };
    const reset = () => tween.current?.pause().progress(0);
    return {
      set,
      sync,
      // A transition (auto or manual) starts: the bar empties and the clock stops.
      transitionStarted() {
        reasons.current.add("busy");
        reset();
      },
      // The new speaker is fully revealed: count its display time from zero.
      transitionEnded() {
        reset();
        set("busy", false);
      },
    };
  }, []);

  // The tween itself (the bar is updated directly, not through React state).
  useEffect(() => {
    const state = { p: 0 };
    tween.current = gsap.to(state, {
      p: 1,
      duration: durationMs / 1000,
      ease: "none",
      paused: true,
      onUpdate: () => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${state.p})`;
      },
      onComplete: () => advance.current(),
    });
    api.sync(); // pause reasons may have changed before the tween existed
    return () => tween.current.kill();
  }, [api, barRef, durationMs]);

  // The visitor's play/pause choice.
  useEffect(() => api.set("user", !playing), [api, playing]);

  // Keyboard focus, visibility in the viewport, hidden tab.
  useEffect(() => {
    const root = rootRef.current;
    // Keyboard focus only: a mouse click on a control doesn't count (it isn't :focus-visible).
    const onFocusIn = (e) => api.set("focus", e.target.matches(":focus-visible"));
    const onFocusOut = (e) => {
      if (!root.contains(e.relatedTarget)) api.set("focus", false);
    };
    const onVisibility = () => api.set("hidden", document.hidden);
    // "At least 50% in view"; on short screens a tall section counts once it fills half the viewport.
    const io = new IntersectionObserver(
      ([entry]) =>
        api.set("offscreen", !(entry.intersectionRatio >= 0.5 || entry.intersectionRect.height >= window.innerHeight * 0.5)),
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );

    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    document.addEventListener("visibilitychange", onVisibility);
    io.observe(root);
    onVisibility();
    return () => {
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, [api, rootRef]);

  return {
    playing,
    toggle: () => setUserChoice(!playing),
    transitionStarted: api.transitionStarted,
    transitionEnded: api.transitionEnded,
  };
}
