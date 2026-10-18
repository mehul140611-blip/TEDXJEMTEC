"use client";

import { Fragment, useRef } from "react";
import Container from "@/components/ui/Container";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";
import { site } from "@/content/site";

// One entry per line; each line is split into words for the scroll reveal.
const lines = site.eventDescription.map((line) => line.split(" "));

export default function ThemeSection() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // Each word brightens from faint to white; the whole reveal completes within ~200px of scroll.
      gsap.fromTo(
        q("[data-word]"),
        { opacity: 0.25 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-words]")[0], start: "top 75%", end: "+=200", scrub: 0.5 },
        }
      );

      gsap.fromTo(
        q("[data-parallax]"),
        { xPercent: 6 },
        {
          xPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-labelledby="theme-title" className="section-y relative overflow-hidden bg-black">
      {/* Static wrapper centres; the inner element is free for GSAP transforms. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div
          data-parallax
          className="outline-text whitespace-nowrap text-[clamp(6rem,17vw,16rem)] font-black uppercase leading-none tracking-[-0.02em]"
        >
          Beyond the Frame
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(235,0,40,0.14),transparent_55%)]"
      />

      <Container className="relative">
        <p className="type-label text-muted">The theme · {site.themeSubtitle}</p>
        {/* font-bold! overrides the theme-line utility's regular weight (still the italic serif). */}
        <h2 id="theme-title" className="font-theme-line mt-6 text-[clamp(56px,7vw,112px)] font-bold! leading-none">
          {site.theme}
        </h2>
        {/* Compact: 16px (14px below 768px), max 60ch. The word reveal runs across all lines. */}
        <div
          data-words
          className="mt-8 flex max-w-[60ch] flex-col gap-1 text-[14px] font-medium leading-[1.6] text-white md:text-[16px]"
        >
          {lines.map((words, l) => (
            <p key={l}>
              {words.map((word, i) => (
                <Fragment key={i}>
                  <span data-word>{word}</span>
                  {i < words.length - 1 && " "}
                </Fragment>
              ))}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
