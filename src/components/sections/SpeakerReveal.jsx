"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import FrameCorners from "@/components/ui/FrameCorners";
import { SpeakerAside, SpeakerCards, SpeakerName } from "./SpeakerDetails";
import RevealControls from "./RevealControls";
import useRevealInput from "./useRevealInput";
import useSpeakerAutoplay from "./useSpeakerAutoplay";
import { gsap, ScrollTrigger, ease, prefersReducedMotion } from "@/lib/motion";
import { assemble, buildTiles, shatter } from "@/lib/tiles";
import { onIntroDone } from "@/lib/intro";
import { SPEAKER_AUTOPLAY_MS, fullName } from "@/content/speakers";
import { OPEN_SPEAKER_EVENT } from "@/lib/speakerEvents";

const SWAP_AT = 0.6; // content switches to the next speaker once the old photo has shattered

/**
 * Speaker Reveal (#speakers): one GSAP sequence per step. Out (text drifts up, photo shatters
 * into 10×10 tiles) → empty ring → the next speaker's tiles assemble → text and cards in.
 * The first speaker assembles when the section scrolls into view. Auto-advances every
 * SPEAKER_AUTOPLAY_MS after each reveal finishes (useSpeakerAutoplay), with a pause button.
 */
export default function SpeakerReveal({ speakers }) {
  const root = useRef(null);
  const imgRef = useRef(null);
  const tilesRef = useRef(null);
  const barRef = useRef(null);
  const ctx = useRef(null);
  const busyRef = useRef(true);
  const indexRef = useRef(0);
  const pendingIn = useRef(false);
  const queuedRef = useRef(null); // speaker index requested from outside while busy
  const goToRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [reached, setReached] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [autoAnnounce, setAutoAnnounce] = useState(false); // the last change came from the timer
  const total = speakers.length;
  const speaker = speakers[index];

  // One GSAP context for everything this component animates; reverted on unmount.
  useLayoutEffect(() => {
    const context = gsap.context(() => {}, root);
    ctx.current = context;
    return () => context.revert();
  }, []);

  const commit = (next, auto) => {
    pendingIn.current = true;
    indexRef.current = next;
    setIndex(next);
    setAutoAnnounce(auto);
    setAnnouncement(`Speaker ${next + 1} of ${total}: ${fullName(speakers[next])}`);
  };

  // Shows speaker `next` (an index). `auto`: called by the timer. Manual and timed steps share the
  // busy guard, so a click right before the timer fires moves exactly one speaker.
  const goTo = (next, auto = false) => {
    if (busyRef.current || next === indexRef.current) return; // extra clicks during a transition are ignored
    busyRef.current = true;
    setBusy(true);
    autoplay.transitionStarted();

    ctx.current.add(() => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) {
        gsap.to(q("[data-swap]"), { opacity: 0, duration: 0.1, onComplete: () => commit(next, auto) });
        return;
      }
      const tl = gsap.timeline();
      tl.to(q("[data-out]"), { opacity: 0, y: -16, duration: 0.35, stagger: 0.04, ease: "power2.in" }, 0).to(
        q("[data-card]"),
        { opacity: 0, duration: 0.3 },
        0
      );
      const tiles = buildTiles(tilesRef.current, speakers[indexRef.current].photo);
      gsap.set(imgRef.current, { opacity: 0 });
      shatter(tl, tiles, 0);
      tl.call(() => commit(next, auto), [], SWAP_AT);
    });
  };
  const go = (direction, auto = false) => goTo((indexRef.current + direction + total) % total, auto);

  const autoplay = useSpeakerAutoplay({ rootRef: root, barRef, durationMs: SPEAKER_AUTOPLAY_MS, onAdvance: () => go(1, true) });
  const input = useRevealInput(root, go);
  const { transitionEnded } = autoplay;

  useEffect(() => {
    goToRef.current = goTo;
  });

  // Schedule links: openSpeaker(id) shows that speaker (queued until the current transition ends).
  useEffect(() => {
    const onOpen = (event) => {
      const target = speakers.findIndex((s) => s.id === event.detail?.id);
      if (target < 0) return;
      if (busyRef.current) queuedRef.current = target;
      else goToRef.current(target);
    };
    window.addEventListener(OPEN_SPEAKER_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SPEAKER_EVENT, onOpen);
  }, [speakers]);

  // First entrance (when the section is reached) and the "in" half of every step, before paint.
  useLayoutEffect(() => {
    const release = () => {
      busyRef.current = false;
      setBusy(false);
      transitionEnded(); // the display time starts counting now
      // A schedule click that arrived mid-transition (or before the first reveal) runs now.
      const queued = queuedRef.current;
      queuedRef.current = null;
      if (queued !== null) goToRef.current(queued);
    };
    const showPhoto = () => {
      const img = imgRef.current;
      const reveal = () => {
        gsap.set(img, { opacity: 1 });
        tilesRef.current?.replaceChildren();
      };
      if (img.complete && img.naturalWidth) reveal();
      else img.decode().then(reveal, reveal);
    };
    // Photo assembles; honorific → name words → title; tagline → label → rule → keywords; cards.
    const runIn = () =>
      ctx.current.add(() => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ defaults: { ease: ease.out }, onComplete: release });
        gsap.set(q("[data-out]"), { opacity: 1, y: 0 });
        gsap.set(imgRef.current, { opacity: 0 });
        assemble(tl, buildTiles(tilesRef.current, speakers[indexRef.current].photo), 0.15);
        tl.call(showPhoto, [], 0.78)
          .fromTo(q("[data-in='honorific']"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, 0.4)
          .fromTo(q("[data-in='word']"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, 0.45)
          .fromTo(q("[data-in='title']"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 0.62)
          .fromTo(q("[data-in='tagline']"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 0.4)
          .fromTo(q("[data-in='label']"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, 0.5)
          .fromTo(q("[data-in='rule']"), { scaleX: 0 }, { scaleX: 1, duration: 0.45 }, 0.56)
          .fromTo(q("[data-in='kw']"), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.28, stagger: 0.06 }, 0.55)
          // clearProps: leave no inline transform, so the LinkedIn card's CSS hover lift works.
          .fromTo(q("[data-card]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.1, clearProps: "transform" }, 0.45);
      });

    if (pendingIn.current) {
      pendingIn.current = false;
      if (!prefersReducedMotion()) runIn();
      else ctx.current.add(() => gsap.fromTo(root.current.querySelectorAll("[data-swap]"), { opacity: 0 }, { opacity: 1, duration: 0.1, onComplete: release }));
      return;
    }

    // First mount: wait (hidden, below the fold) until the section is reached after the intro.
    const reduce = prefersReducedMotion();
    if (reduce) release();
    else {
      ctx.current.add(() => {
        gsap.set(imgRef.current, { opacity: 0 });
        gsap.set(root.current.querySelectorAll("[data-in], [data-card]"), { opacity: 0 });
      });
    }
    return onIntroDone(() =>
      ctx.current.add(() =>
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            setReached(true);
            if (!reduce) runIn();
          },
        })
      )
    );
  }, [index, speakers, transitionEnded]);

  // Preload the neighbours once the section has been reached (lazy below the fold).
  useEffect(() => {
    if (!reached) return;
    [index - 1, index + 1].forEach((i) => {
      const img = new Image();
      img.src = speakers[(i + total) % total].photo;
    });
  }, [reached, index, speakers, total]);

  return (
    <div
      ref={root}
      role="group"
      aria-roledescription="carousel"
      aria-label="Speaker reveal"
      {...input}
      className="relative isolate overflow-hidden pb-[var(--section-y)] pt-12 lg:pt-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_38%,rgba(138,0,24,0.38),transparent_55%),radial-gradient(circle_at_0%_0%,rgba(235,0,40,0.14),transparent_45%)]"
      />
      <div className="container-site reveal-grid">
        <h2 id="speaker-reveal-title" className="[grid-area:title] text-[clamp(3rem,1rem+6vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.02em]">
          Speaker Reveal
        </h2>
        <p className="type-label mt-4 text-muted [grid-area:label] lg:self-center">Meet our lineup</p>

        <RevealControls
          current={index + 1}
          total={total}
          busy={busy}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          playing={autoplay.playing}
          onToggle={autoplay.toggle}
          barRef={barRef}
          className="mt-8 justify-center [grid-area:controls] lg:mt-4 lg:justify-end"
        />

        <div data-swap className="mt-10 [grid-area:name] lg:mt-20">
          <SpeakerName speaker={speaker} />
        </div>

        <div className="relative mx-auto mt-12 size-[260px] [grid-area:photo] lg:mt-20 lg:size-[340px]">
          <FrameCorners inset={-18} size={26} />
          <div className="absolute inset-0 rounded-full border-[3px] border-white shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
            <div data-swap className="absolute inset-0 overflow-hidden rounded-full bg-surface-2 shadow-[inset_0_10px_40px_rgba(0,0,0,0.75)] [clip-path:circle(50%)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- swapped mid-animation; tiles need the same plain URL */}
              <img
                ref={imgRef}
                src={speaker.photo}
                alt={`Portrait of ${fullName(speaker)}`}
                width={800}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div ref={tilesRef} aria-hidden="true" className="absolute inset-0" />
            </div>
          </div>
        </div>

        <div data-swap className="mt-10 [grid-area:aside] lg:mt-20">
          <SpeakerAside speaker={speaker} />
        </div>

        <div data-swap className="mt-14 [grid-area:cards] lg:mt-20">
          <SpeakerCards speaker={speaker} />
        </div>
      </div>

      {/* Quiet during auto-advance; announced when navigation is manual or the timer is paused. */}
      <p className="sr-only" aria-live={autoAnnounce && autoplay.playing ? "off" : "polite"}>
        {announcement}
      </p>
    </div>
  );
}
