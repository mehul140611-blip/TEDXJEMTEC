"use client";

import { Fragment, useRef } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import RegisterButton from "@/components/ui/RegisterButton";
import FrameCorners from "@/components/ui/FrameCorners";
import { gsap, useGSAP, ease, prefersReducedMotion } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";
import { site } from "@/content/site";

const themeWords = site.theme.split(" ");

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const items = q("[data-hero-item]");
      const corners = q("[data-hero-frame] > span");

      const tl = gsap.timeline({ paused: true, defaults: { ease: ease.out } });
      tl.fromTo(q("[data-enter='bg']"), { scale: 1.08 }, { scale: 1, duration: 1.8, ease: "power2.out" }, 0)
        .fromTo(
          items,
          { opacity: 0, y: (i, el) => (el.dataset.word ? 40 : 24) },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
          0.15
        )
        .set(q("[data-hero-frame]"), { opacity: 1 })
        .fromTo(corners, { scale: 0 }, { scale: 1, duration: 0.6, stagger: 0.08 }, ">-0.35")
        .fromTo(q("[data-hero-cue]"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, "<");

      return onIntroDone(() => tl.play());
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      data-loops=""
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-black"
    >
      <div data-enter="bg" className="hero-media -z-10 will-change-transform">
        <picture className="block h-full w-full">
          <source srcSet="/images/hero-stage.webp" type="image/webp" />
          <img
            src="/images/hero-stage.jpg"
            alt="The TEDxJEMTEC stage: large red 3D TEDx letters on a platform under spotlights"
            width={1942}
            height={809}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </picture>
        {/* Top shade keeps the navbar legible over the spotlights; bottom fades the stage into black. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,transparent_24%,transparent_58%,#000_100%)]"
        />
      </div>
      {/* Above the banner so the glow blends across its fade instead of meeting it at a seam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-[radial-gradient(ellipse_70%_90%_at_12%_100%,rgba(138,0,24,0.32),transparent_70%)]"
      />

      <Container className="relative pb-20 pt-[calc(var(--nav-h)+24px)] sm:pb-24">
        <div className="relative inline-flex max-w-full flex-col items-start gap-4 p-5 sm:gap-5 sm:p-7">
          {/* Decorative: must never catch taps. Without the entrance animation (reduced motion) the
              buttons aren't lifted above it, so it would otherwise cover Register / Meet the speakers. */}
          <span data-hero-frame data-enter aria-hidden="true" className="pointer-events-none absolute inset-0">
            <FrameCorners inset={0} />
          </span>
          <p data-hero-item data-enter className="type-label text-white/80">
            <time dateTime={site.dateISO}>{site.dateLabel}</time> · {site.venueName}
          </p>
          <h1 id="hero-title">
            <span className="sr-only">{site.eventName} — </span>
            <span className="font-theme-line block text-[clamp(3.25rem,1.6rem+5.2vw,6rem)] leading-[0.95]">
              {themeWords.map((word, i) => (
                <Fragment key={word}>
                  <span data-hero-item data-word data-enter className="inline-block">
                    {word}
                  </span>
                  {i < themeWords.length - 1 && " "}
                </Fragment>
              ))}
            </span>
          </h1>
          <p data-hero-item data-enter className="text-sm font-semibold uppercase tracking-[0.22em] sm:text-base">
            {site.themeSubtitle}
          </p>
          <div data-hero-item data-enter className="mt-3 flex flex-wrap gap-4">
            <RegisterButton />
            <Button href="/#speakers" variant="secondary">
              Meet the speakers
            </Button>
          </div>
        </div>
      </Container>

      <div
        data-hero-cue
        data-enter
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden h-14 w-px -translate-x-1/2 bg-white/25 sm:block"
      >
        <span className="scroll-cue-dot absolute -left-[2.5px] top-0 block h-1.5 w-1.5 rounded-full bg-red shadow-[0_0_10px_rgba(235,0,40,0.9)] motion-reduce:hidden" />
      </div>
    </section>
  );
}
