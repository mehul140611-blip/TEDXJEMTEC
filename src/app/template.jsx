"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, ease, prefersReducedMotion } from "@/lib/motion";
import { navState } from "@/lib/transition";

// Remounts on every route change: fade and lift the new page in (not on the first load).
export default function Template({ children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (!navState.clientNavigated || prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: ease.out,
          clearProps: "opacity,transform",
          onComplete: () => ScrollTrigger.refresh(),
        }
      );
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
