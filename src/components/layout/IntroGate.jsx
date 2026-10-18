"use client";

import { useLayoutEffect, useRef, useState } from "react";
import InlineScript from "@/components/ui/InlineScript";
import { gsap } from "@/lib/motion";
import {
  INTRO_FADE,
  INTRO_HARD_CAP,
  INTRO_SEEN_KEY,
  INTRO_START_TIMEOUT,
  markIntroDone,
  readIntroMode,
  readMotionMode,
  setIntroPlaying,
} from "@/lib/intro";

const VIDEO_ID = "intro-video";

// Runs right after the <video> is parsed: start playback early, reveal the video only once
// frames are playing (so the poster never flashes before the dark opening), or stand down on skip.
const videoScript = `(function(){var v=document.getElementById("${VIDEO_ID}");if(!v)return;if(document.documentElement.dataset.intro!=="play"){v.autoplay=false;v.preload="none";return}v.muted=true;var s=function(){v.style.opacity="1"};if(!v.paused&&v.currentTime>0)s();else v.addEventListener("playing",s,{once:true});var p=v.play();if(p&&p.catch)p.catch(function(){})})()`;

/**
 * Plays the intro once per browser session, before any content, on whichever page the
 * visitor lands. No skip button (team decision). Visibility before hydration is driven
 * by the <head> script + CSS (`html[data-intro="play"]`), so there is no flash of content.
 */
export default function IntroGate() {
  const gateRef = useRef(null);
  const videoRef = useRef(null);
  const [removed, setRemoved] = useState(false);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const video = videoRef.current;
    const mode = readIntroMode();
    // Re-apply: React resets <html> attributes on dev remounts.
    root.dataset.intro = mode;
    root.dataset.motion = readMotionMode();

    if (mode !== "play") {
      video?.pause();
      markIntroDone();
      return;
    }
    setIntroPlaying();

    let finished = false;
    let completed = false;
    let started = !video.paused && video.currentTime > 0;
    const timers = [];

    const complete = () => {
      if (completed) return;
      completed = true;
      root.dataset.intro = "done";
      setRemoved(true);
      document.getElementById("main")?.focus({ preventScroll: true });
      markIntroDone();
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      try {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {
        // Storage blocked: the intro may replay next visit, which is harmless.
      }
      // If playback never started, show the poster (the stage) so the fade still reads as a crossfade.
      if (!started) video.style.opacity = "1";
      gsap.to(gateRef.current, { opacity: 0, duration: INTRO_FADE, ease: "power2.out", onComplete: complete });
      // Removal must not depend on animation frames (throttled tabs, stalled rAF).
      timers.push(setTimeout(complete, INTRO_FADE * 1000 + 100));
    };
    const onPlaying = () => {
      started = true;
    };
    const lastSource = video.querySelector("source:last-of-type");

    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);
    lastSource?.addEventListener("error", finish);

    // Timers count from navigation start, so a slow hydration can't extend the intro.
    const elapsed = performance.now();
    timers.push(setTimeout(() => !started && finish(), Math.max(0, INTRO_START_TIMEOUT - elapsed)));
    timers.push(setTimeout(finish, Math.max(0, INTRO_HARD_CAP - INTRO_FADE * 1000 - 100 - elapsed)));

    if (video.ended || video.error) finish();

    return () => {
      timers.forEach(clearTimeout);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
      lastSource?.removeEventListener("error", finish);
    };
  }, []);

  if (removed) return null;

  return (
    <div ref={gateRef} className="intro-gate" aria-hidden="true">
      <video
        ref={videoRef}
        id={VIDEO_ID}
        muted
        playsInline
        autoPlay
        preload="auto"
        poster="/media/intro-poster.jpg"
        suppressHydrationWarning
      >
        <source src="/media/intro.webm" type="video/webm" />
        <source src="/media/intro.mp4" type="video/mp4" />
      </video>
      <InlineScript html={videoScript} />
    </div>
  );
}
