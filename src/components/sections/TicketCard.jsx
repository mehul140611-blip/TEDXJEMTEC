"use client";

import { useRef } from "react";
import Logo from "@/components/ui/Logo";
import Brand from "@/components/ui/Brand";
import RegisterButton from "@/components/ui/RegisterButton";
import { gsap, useGSAP } from "@/lib/motion";
import { site, startTimeText } from "@/content/site";

const TILT_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 1024px)";
const MAX_TILT = 10;

// DATE · TIME on the first row; VENUE spans the full width on the second.
const details = [
  { label: "Date", value: site.dateLabel },
  { label: "Time", value: startTimeText },
  { label: "Venue", value: site.venueName, wide: true },
];

/** "Admit one" ticket. Desktop pointers tilt it in 3D with a glare; touch screens get an idle float. */
export default function TicketCard() {
  const cardRef = useRef(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      const glare = card.querySelector("[data-glare]");
      const mm = gsap.matchMedia();

      mm.add({ tilt: TILT_QUERY, reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { tilt, reduce } = context.conditions;
        if (reduce) return;

        if (!tilt) {
          // Idle float, paused while the ticket is off-screen.
          gsap.to(card, {
            y: -10,
            duration: 3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            scrollTrigger: { trigger: card, toggleActions: "play pause resume pause" },
          });
          return;
        }

        gsap.set(card, { transformPerspective: 1200 });
        const rotX = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power3.out" });
        const rotY = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power3.out" });

        const onMove = (event) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          rotY((px - 0.5) * 2 * MAX_TILT);
          rotX((0.5 - py) * 2 * MAX_TILT);
          card.style.setProperty("--gx", `${px * 100}%`);
          card.style.setProperty("--gy", `${py * 100}%`);
          gsap.to(glare, { opacity: 1, duration: 0.3, overwrite: "auto" });
        };
        const onLeave = () => {
          rotX(0);
          rotY(0);
          gsap.to(glare, { opacity: 0, duration: 0.5, overwrite: "auto" });
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        return () => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: cardRef }
  );

  return (
    <article
      ref={cardRef}
      aria-label={`${site.eventName} 2026 ticket`}
      className="relative mx-auto grid w-full max-w-[1000px] will-change-transform lg:min-h-[460px] lg:grid-cols-[7fr_3fr]"
    >
      <div className="ticket-part ticket-main flex flex-col justify-between gap-10 p-7 sm:p-10 lg:p-12">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="accent-label type-label text-white">
              <Brand suffix=" 2026" /> · {site.theme}
            </p>
            <p className="mt-4 text-[clamp(3.25rem,1.6rem+4.4vw,5.5rem)] font-black uppercase leading-[0.88] tracking-[-0.02em]">
              <span className="block">Admit</span>
              <span className="block text-red">One</span>
            </p>
          </div>
          <div className="sm:text-right">
            <p className="type-label text-muted">Registration</p>
            <p className="mt-2 text-lg font-extrabold uppercase tracking-[0.04em]">Open</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:gap-x-10">
          {details.map((item) => (
            <div key={item.label} className={item.wide ? "col-span-2" : ""}>
              <dt className="type-label text-muted">{item.label}</dt>
              <dd className="mt-1.5 text-[0.9375rem] font-bold sm:text-base">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="ticket-part ticket-stub flex flex-col items-center justify-center gap-8 px-7 pb-10 pt-12 sm:px-10 lg:px-8 lg:py-10 lg:pr-12">
        <Logo className="h-6 w-auto sm:h-7" alt={site.eventName} />
        <RegisterButton size="lg" className="w-full max-w-[260px]" />
        <p
          aria-hidden="true"
          className="absolute right-3 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[0.6875rem] tracking-[0.25em] text-muted [writing-mode:vertical-rl] lg:block"
        >
          #TEDxJEMTEC-2026
        </p>
      </div>

      <div data-glare aria-hidden="true" className="ticket-glare hidden lg:block" />
    </article>
  );
}
