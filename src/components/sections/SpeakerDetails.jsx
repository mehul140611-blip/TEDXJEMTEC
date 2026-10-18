import { useLayoutEffect, useRef } from "react";
import { ArrowIcon, LinkedInIcon } from "@/components/ui/icons";
import { site } from "@/content/site";
import { fullName } from "@/content/speakers";

/**
 * Keyword cloud styles, cycled by position: mixed sizes (16–44px), weights (400–900),
 * cases and colours. Red and the faint tone only appear at ≥ 24px so contrast holds.
 * `block` items start a new line, which gives the stacked-and-inline cloud shape.
 */
const cloud = [
  "block text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] font-black uppercase text-white",
  "text-[1rem] font-normal lowercase text-muted",
  "block text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] font-extrabold uppercase text-red",
  "text-[clamp(1.5rem,1.2rem+0.8vw,1.875rem)] font-medium text-white",
  "block text-[clamp(1.5rem,1.2rem+0.8vw,1.875rem)] font-bold uppercase text-white/40",
  "text-[1.125rem] font-semibold uppercase tracking-[0.08em] text-muted",
  "block text-[clamp(1.75rem,1.3rem+1.2vw,2.5rem)] font-black text-white",
  "text-[1rem] font-medium text-muted",
];

function keywordClass(keyword, i) {
  const base = cloud[i % cloud.length];
  // Keep the event name's lowercase "x" and set the theme line in its serif italic.
  if (keyword === site.eventName) return `${base} normal-case!`;
  if (keyword === site.theme) return `${base} font-theme-line normal-case!`;
  return base;
}

/**
 * Long words ("UPADHYAY", "BRIJENDRA") can be wider than the name column at the full heading size.
 * Words never break; instead the heading shrinks just enough for its longest word to fit the
 * column, re-measured whenever the column resizes (fonts, viewport).
 */
function useFitLongestWord(boxRef, headingRef, key) {
  useLayoutEffect(() => {
    const box = boxRef.current;
    const heading = headingRef.current;
    const fit = () => {
      heading.style.fontSize = ""; // back to the CSS clamp() size
      const available = box.clientWidth;
      const widest = Math.max(
        ...[...heading.querySelectorAll("[data-in='word']")].map((word) => {
          const range = document.createRange();
          range.selectNodeContents(word);
          return range.getBoundingClientRect().width;
        })
      );
      if (widest > available) {
        const size = parseFloat(getComputedStyle(heading).fontSize);
        heading.style.fontSize = `${Math.floor(size * (available / widest) * 0.98)}px`;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [boxRef, headingRef, key]);
}

export function SpeakerName({ speaker }) {
  const box = useRef(null);
  const heading = useRef(null);
  useFitLongestWord(box, heading, speaker.id);

  return (
    <div ref={box} className="flex flex-col items-center gap-5 text-center lg:items-end lg:text-right">
      {/* Honorific on its own small line; the heading below is the name alone. */}
      <p data-out data-in="honorific" className="type-label -mb-2 text-muted">
        {speaker.honorific}
      </p>
      <h3
        ref={heading}
        data-out
        className="max-w-full text-[clamp(2.5rem,0.8rem+3.6vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.02em]"
      >
        {/* Each word on its own line, never broken; the real spaces keep the accessible name "Deepak Vohra". */}
        {speaker.name.split(" ").map((word, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span data-in="word" className="block whitespace-nowrap">
              {word}
            </span>
          </span>
        ))}
      </h3>
      <p data-out data-in="title" className="max-w-[28ch] text-sm font-medium uppercase tracking-[0.14em] text-muted">
        {speaker.title}
      </p>
    </div>
  );
}

export function SpeakerAside({ speaker }) {
  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      <p data-out data-in="tagline" className="max-w-[22ch] text-[1.5rem] font-bold leading-[1.25] lg:text-[1.75rem]">
        {speaker.tagline}
      </p>
      <p data-out data-in="label" className="type-label mt-7 text-white">
        {speaker.labelLine}
      </p>
      <span data-in="rule" aria-hidden="true" className="mt-3 block h-[2px] w-8 origin-left bg-red max-lg:origin-center" />
      <ul data-out aria-label="Keywords" className="mt-6 leading-[1.05] tracking-[-0.01em]">
        {speaker.keywords.map((keyword, i) => (
          <li
            key={`${keyword}-${i}`}
            data-in="kw"
            className={`mr-3 inline-block align-baseline ${i >= 5 ? "max-lg:hidden" : ""} ${keywordClass(keyword, i)}`}
          >
            {keyword}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpeakerCards({ speaker }) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Speaker facts"
      data-scroller
      className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0"
    >
      {speaker.cards.map((card) => (
        <div key={card.label} data-card className={`card ${cardSize}`}>
          <p className="accent-label type-label text-white">{card.label}</p>
          <p className={`mt-3 text-[0.9375rem] leading-relaxed text-white/90 ${card.italic ? "italic" : ""}`}>{card.body}</p>
        </div>
      ))}
      <LinkedInCard speaker={speaker} />
    </div>
  );
}

const cardSize = "w-[80%] shrink-0 snap-start p-7 sm:w-[60%] lg:w-auto";

/** 3rd fact card, from `speaker.linkedin`: one link to the profile, or "Profile coming soon". */
function LinkedInCard({ speaker }) {
  const content = (live) => (
    <>
      <p className="accent-label type-label text-white">LinkedIn</p>
      <p className={`mt-3 flex items-center gap-2.5 text-[0.9375rem] font-semibold ${live ? "text-white" : "text-muted"}`}>
        <LinkedInIcon size={18} />
        {live ? "View profile" : "Profile coming soon"}
        {live && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            <ArrowIcon />
          </span>
        )}
      </p>
    </>
  );

  if (!speaker.linkedin) {
    return (
      <div data-card className={`card ${cardSize}`}>
        {content(false)}
      </div>
    );
  }
  return (
    <a
      data-card
      href={speaker.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${fullName(speaker)} on LinkedIn (opens in new tab)`}
      className={`card card-interactive group block ${cardSize}`}
    >
      {content(true)}
    </a>
  );
}
