"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import FrameCorners from "@/components/ui/FrameCorners";
import { gsap, ease, prefersReducedMotion } from "@/lib/motion";
import { TransitionContext, markClientNavigation, samePath } from "@/lib/transition";
import { SECTION_IDS, isSeparatePage, scrollToSection } from "@/lib/sections";

const HIDDEN_BELOW = "inset(100% 0% 0% 0%)";
const COVERED = "inset(0% 0% 0% 0%)";
const HIDDEN_ABOVE = "inset(0% 0% 100% 0%)";
// Snappy: ≈0.3s to cover, ≈0.3s to reveal (the route change runs in between, already prefetched).
const COVER = 0.28;
const REVEAL = 0.32;
const SAFETY_MS = 1500;

/**
 * Red wipe between the homepage and the separate pages (/about, /sponsors, /contact). TransitionLink calls `start(href)`:
 * the panel wipes up, router.push() runs under it, the new page lands on its "#section" (if
 * any), and the panel wipes away upward. Back/forward runs only the reveal half. A safety
 * timeout guarantees the panel never stays up.
 */
export default function PageTransition({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef(null);
  const plateRef = useRef(null);
  const phase = useRef("idle"); // idle | covering | covered | revealing
  const safety = useRef(null);
  const lastPath = useRef(pathname);

  const api = useMemo(() => {
    const panel = () => panelRef.current;
    const plate = () => plateRef.current;

    const reset = () => {
      clearTimeout(safety.current);
      gsap.killTweensOf([panel(), plate()]);
      gsap.set(panel(), { clipPath: HIDDEN_BELOW, visibility: "hidden", pointerEvents: "none" });
      gsap.set(plate(), { opacity: 0 });
      phase.current = "idle";
    };

    const reveal = () => {
      if (phase.current === "revealing" || phase.current === "idle") return;
      clearTimeout(safety.current);
      phase.current = "revealing";
      safety.current = setTimeout(reset, SAFETY_MS);
      gsap
        .timeline({ onComplete: reset })
        .to(plate(), { opacity: 0, duration: 0.12, ease: "power2.out" }, 0)
        .to(panel(), { clipPath: HIDDEN_ABOVE, duration: REVEAL, ease: "power2.inOut" }, 0);
    };

    const cover = () => {
      gsap.killTweensOf([panel(), plate()]);
      gsap.set(panel(), { clipPath: COVERED, visibility: "visible", pointerEvents: "auto" });
      gsap.set(plate(), { opacity: 1 });
      phase.current = "covered";
    };

    const start = (href) => {
      const target = new URL(href, window.location.href).pathname;
      const from = window.location.pathname;
      if (samePath(target, from)) return false;
      markClientNavigation();
      // The wipe is only for going to or from the separate pages (/about, /sponsors, /contact).
      if (!isSeparatePage(target) && !isSeparatePage(from)) return false;
      if (prefersReducedMotion()) return false; // instant route change
      if (phase.current !== "idle") return true; // ignore extra clicks mid-transition

      phase.current = "covering";
      router.prefetch(href); // start loading now, so the route is ready when the panel has covered
      const navigate = () => {
        if (phase.current !== "covering") return;
        clearTimeout(safety.current);
        cover(); // guarantees a fully covered start for the reveal, even if frames were dropped
        router.push(href, { scroll: false });
        safety.current = setTimeout(reveal, SAFETY_MS);
      };
      // Navigation must not depend on animation frames arriving (throttled tabs).
      safety.current = setTimeout(navigate, COVER * 1000 + 150);

      gsap.set(panel(), { clipPath: HIDDEN_BELOW, visibility: "visible", pointerEvents: "auto" });
      gsap
        .timeline({ onComplete: navigate })
        .to(panel(), { clipPath: COVERED, duration: COVER, ease: "power2.in" }, 0)
        .to(plate(), { opacity: 1, duration: 0.16, ease: ease.out }, 0.1);
      return true;
    };

    return { start, reveal, cover, reset };
  }, [router]);

  // Back/forward never goes through start(): mark it so template.jsx still animates.
  useEffect(() => {
    window.addEventListener("popstate", markClientNavigation);
    return () => window.removeEventListener("popstate", markClientNavigation);
  }, []);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    // Under the cover: land on the "#section" from the URL (e.g. /about → /#speakers), else the top.
    const land = () => {
      const id = window.location.hash.slice(1);
      if (SECTION_IDS.includes(id) && document.getElementById(id)) {
        scrollToSection(id, { instant: true });
      } else {
        window.scrollTo(0, 0);
        document.getElementById("main")?.focus({ preventScroll: true });
      }
    };

    if (phase.current === "covered") {
      land();
      api.reveal();
    } else if (phase.current === "idle" && !prefersReducedMotion()) {
      api.cover();
      land();
      api.reveal();
    }
  }, [pathname, api]);

  useEffect(() => () => clearTimeout(safety.current), []);

  return (
    <TransitionContext value={api}>
      {children}
      <div
        ref={panelRef}
        aria-hidden="true"
        className="page-wipe fixed inset-0 z-[900] flex items-center justify-center bg-red"
      >
        {/* The logo's red "TEDx" would vanish on the red panel, so it sits on a black plate. */}
        <div ref={plateRef} className="relative rounded-2xl bg-black px-10 py-8 opacity-0 sm:px-14 sm:py-10">
          <FrameCorners inset={-12} />
          <Logo eager alt="" className="h-9 w-auto sm:h-12" />
        </div>
      </div>
    </TransitionContext>
  );
}
