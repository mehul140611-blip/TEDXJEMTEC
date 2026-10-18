"use client";

import { useRef } from "react";
import { gsap, useGSAP, ease, prefersReducedMotion } from "@/lib/motion";

/**
 * Section reveal: fades (and by default lifts y 24→0) once, as soon as it enters the viewport,
 * quickly enough that content is never left waiting while scrolling. `stagger` animates direct
 * children one after another (capped so long lists don't drag). Locked TEDx copy uses `lift={false}`.
 */
export default function Reveal({ as: Tag = "div", lift = true, stagger = 0, className = "", children, ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current;
      const targets = stagger ? el.children : el;
      gsap.from(targets, {
        opacity: 0,
        y: lift ? 24 : 0,
        duration: 0.55,
        ease: ease.out,
        stagger: Math.min(stagger, 0.06),
        clearProps: "transform",
        scrollTrigger: { trigger: el, start: "top 94%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
