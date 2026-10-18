"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);
}

export const ease = {
  out: "power3.out",
  inOut: "power3.inOut",
  soft: "power2.out",
};

export const duration = {
  fast: 0.4,
  base: 0.6,
  slow: 0.9,
};

gsap.defaults({ ease: ease.out, duration: duration.base });

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, useGSAP };
