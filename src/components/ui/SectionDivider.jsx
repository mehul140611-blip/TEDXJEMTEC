"use client";

import { useRef } from "react";
import FrameCorners from "./FrameCorners";
import { gsap, useGSAP, ease, prefersReducedMotion } from "@/lib/motion";

/**
 * Divider between homepage sections: a small red frame-corner marker, an optional label
 * (e.g. "SPEAKERS") and a thin rule. Slides in once as it enters. Decorative: the section
 * has its own heading.
 */
export default function SectionDivider({ label }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(ref);
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top 95%", once: true } })
        .from(q("[data-divider-label]"), { x: -20, opacity: 0, duration: 0.4, ease: ease.out })
        .from(q("[data-divider-rule]"), { scaleX: 0, duration: 0.6, ease: ease.out }, 0.05);
    },
    { scope: ref }
  );

  return (
    <div ref={ref} aria-hidden="true" className="container-site flex items-center gap-4">
      <span data-divider-label className="flex shrink-0 items-center gap-3">
        <span className="relative block size-3.5">
          <FrameCorners tone="red" inset={0} size={6} />
        </span>
        {label && <span className="type-label text-muted">{label}</span>}
      </span>
      <span data-divider-rule className="block h-px flex-1 origin-left bg-line" />
    </div>
  );
}
