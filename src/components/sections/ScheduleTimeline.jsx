"use client";

import { useRef } from "react";
import FrameCorners from "@/components/ui/FrameCorners";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";
import { buildPath, nodeSide, nodeT, waveX } from "@/lib/schedulePath";
import { scrollToSection } from "@/lib/sections";
import { openSpeaker } from "@/lib/speakerEvents";
import { fullName, speakers } from "@/content/speakers";

const SSR_BOX = 1000;
const DESKTOP = "(min-width: 1024px)";

/** The speaker's name ("Mr. Deepak Vohra"); a button that opens that speaker in the Speaker Reveal. */
function SessionTitle({ session }) {
  const speaker = speakers.find((s) => s.id === session.speakerId);
  if (!speaker) return session.title;
  const open = () => {
    scrollToSection("speakers");
    openSpeaker(speaker.id);
  };
  return (
    <button
      type="button"
      onClick={open}
      className="cursor-pointer underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-300 [text-align:inherit] hover:decoration-red focus-visible:decoration-red"
    >
      {fullName(speaker)}
    </button>
  );
}

/**
 * Scroll-drawn path: a grey track, a red progress stroke scrubbed by ScrollTrigger, and a
 * "head" riding its tip. Sessions sit on the curve's peaks and activate as the head passes.
 */
export default function ScheduleTimeline({ sessions }) {
  const root = useRef(null);
  const n = sessions.length;
  // Server/first paint: the same curve in a normalised box, stretched to fit.
  const ssrPath = buildPath(SSR_BOX, SSR_BOX, n);

  useGSAP(
    () => {
      const box = root.current;
      const svg = box.querySelector("svg");
      const base = box.querySelector("[data-base]");
      const progress = box.querySelector("[data-progress]");
      const head = box.querySelector("[data-head]");
      const nodes = [...box.querySelectorAll("[data-node]")];
      // Geometry is measured on a detached copy: Chrome treats `d` as a CSS property, so a live
      // path can report the previous shape's length right after its `d` changes.
      const measure = document.createElementNS("http://www.w3.org/2000/svg", "path");
      let length = 0;
      let height = 0;

      // Rebuild the path in real pixels so dash lengths and the head position are exact.
      const layout = () => {
        const width = box.clientWidth;
        height = box.clientHeight;
        const mode = window.matchMedia(DESKTOP).matches ? "wave" : "line";
        const d = buildPath(width, height, n, mode);
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        base.setAttribute("d", d);
        progress.setAttribute("d", d);
        measure.setAttribute("d", d);
        svg.dataset.mode = mode;
        length = measure.getTotalLength();
        progress.style.strokeDasharray = `${length}`;
      };

      const render = (p) => {
        progress.style.strokeDashoffset = `${length * (1 - p)}`;
        const tip = measure.getPointAtLength(length * p);
        head.style.transform = `translate(${tip.x}px, ${tip.y}px)`;
        nodes.forEach((node, i) => node.toggleAttribute("data-active", tip.y >= nodeT(i, n) * height - 1));
      };

      layout();
      progress.dataset.ready = "";
      head.dataset.ready = "";

      const reduce = prefersReducedMotion();
      const state = { p: reduce ? 1 : 0 };
      // Re-measure whenever the box itself settles or changes size (first layout, fonts, resize).
      const ro = new ResizeObserver(() => {
        layout();
        render(state.p);
      });
      ro.observe(box);

      if (reduce) {
        // Full path, every node active, no scrub.
        render(1);
        return () => ro.disconnect();
      }

      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => render(state.p),
        scrollTrigger: {
          trigger: box,
          start: "top 62%",
          end: "bottom 62%",
          scrub: 0.25,
          onRefresh: () => {
            layout();
            render(state.p);
          },
        },
      });
      render(0);
      return () => ro.disconnect();
    },
    { scope: root }
  );

  return (
    // Height grows with the session count: at least 130px (and 18vh) between nodes.
    <div ref={root} className="relative" style={{ height: `max(${n * 18}vh, ${n * 130}px)` }}>
      <svg
        aria-hidden="true"
        className="schedule-svg absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${SSR_BOX} ${SSR_BOX}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <path data-base d={ssrPath} className="stroke-line" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path
          data-progress
          d={ssrPath}
          className="schedule-progress stroke-red"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div data-head aria-hidden="true" className="schedule-head">
        <FrameCorners tone="red" inset={-10} size={7} />
      </div>

      <ol aria-label="Sessions" className="absolute inset-0">
        {sessions.map((session, i) => {
          const t = nodeT(i, n);
          return (
            <li
              key={session.id}
              data-node
              className="schedule-node"
              style={{ "--x": `${waveX(t, n) * 100}%`, "--y": `${t * 100}%` }}
            >
              <span aria-hidden="true" className="node-dot" />
              <div className="node-wrap" data-side={nodeSide(i)}>
                <div className="node-body">
                  {/* 20px bold on phones keeps "11:45 AM – 12:00 PM" on one line (red stays ≥ 19px bold). */}
                  <p className="whitespace-nowrap text-xl font-bold text-red lg:text-2xl">{session.time}</p>
                  <h3 className="mt-1 text-xl font-bold leading-snug">
                    <SessionTitle session={session} />
                  </h3>
                  {session.description && (
                    <p className="mt-2 max-w-[32ch] text-[0.9375rem] leading-relaxed text-muted">{session.description}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
