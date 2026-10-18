import { buttonClasses } from "@/components/ui/Button";

const pad = (n) => String(n).padStart(2, "0");

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="currentColor">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

/**
 * ← PREV · 01 / 11 · NEXT →, the auto-advance progress bar under them, and the pause/play
 * button (required: content that moves on its own needs a pause control, WCAG 2.2.2).
 * Prev/Next stay focusable while busy (aria-disabled) so focus is never lost.
 */
export default function RevealControls({ current, total, busy, onPrev, onNext, playing, onToggle, barRef, className = "" }) {
  const pill = buttonClasses({ variant: "secondary", size: "sm", className: "aria-disabled:opacity-60 aria-disabled:cursor-wait" });

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <button type="button" onClick={onPrev} aria-disabled={busy} className={pill}>
            <span aria-hidden="true">←</span> Prev<span className="sr-only">ious speaker</span>
          </button>
          <p className="min-w-[5.5rem] text-center font-extrabold tabular-nums">
            {/* Red text only at ≥ 19px bold (contrast rule). */}
            <span className="text-[1.25rem] text-red">{pad(current)}</span>
            <span className="text-base text-muted"> / {pad(total)}</span>
          </p>
          <button type="button" onClick={onNext} aria-disabled={busy} className={pill}>
            Next<span className="sr-only"> speaker</span> <span aria-hidden="true">→</span>
          </button>
        </div>
        {/* Time left on the current speaker; filled by useSpeakerAutoplay (no re-renders). */}
        <div aria-hidden="true" className="h-[2px] w-full overflow-hidden rounded-full bg-line">
          <div ref={barRef} className="h-full w-full origin-left bg-red" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={!playing}
        aria-label={playing ? "Pause speaker slideshow" : "Play speaker slideshow"}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-[border-color,transform] duration-300 hover:scale-[1.03] hover:border-white/60"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
}
