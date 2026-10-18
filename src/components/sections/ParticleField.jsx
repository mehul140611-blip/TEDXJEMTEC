"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const RED = "235, 0, 40";

function seed(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.6 + Math.random() * 1.4,
    vx: (Math.random() - 0.5) * 8,
    vy: -4 - Math.random() * 10, // px per second, drifting slowly upward
    a: 0.25 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2,
  }));
}

function newStreak(w, h) {
  const fromLeft = Math.random() < 0.5;
  const angle = (fromLeft ? -1 : 1) * (0.25 + Math.random() * 0.35);
  return {
    x: fromLeft ? -80 : w + 80,
    y: h * (0.2 + Math.random() * 0.6),
    dx: (fromLeft ? 1 : -1) * Math.cos(angle),
    dy: Math.sin(angle),
    speed: 700 + Math.random() * 500,
    len: 90 + Math.random() * 90,
  };
}

/**
 * Slowly drifting red particles plus an occasional light streak, on a 2D canvas.
 * Pauses when off-screen or when the tab is hidden; off entirely under reduced motion.
 * Also flags its parent section (`data-fx`) so CSS ring glows pause with it.
 */
export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const section = canvas.closest("section");
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const count = mobile ? 40 : 120;

    let w = 0;
    let h = 0;
    let particles = [];
    let streak = null;
    let nextStreakAt = 2 + Math.random() * 3;
    let raf = 0;
    let last = 0;
    let clock = 0;
    let inView = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = seed(count, w, h);
    };

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clock += dt;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y < -4) p.y = h + 4;
        if (p.x < -4) p.x = w + 4;
        else if (p.x > w + 4) p.x = -4;
        const twinkle = 0.65 + 0.35 * Math.sin(clock * 1.5 + p.phase);
        ctx.fillStyle = `rgba(${RED}, ${p.a * twinkle})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!streak && clock > nextStreakAt) streak = newStreak(w, h);
      if (streak) {
        streak.x += streak.dx * streak.speed * dt;
        streak.y += streak.dy * streak.speed * dt;
        const tx = streak.x - streak.dx * streak.len;
        const ty = streak.y - streak.dy * streak.len;
        const grad = ctx.createLinearGradient(tx, ty, streak.x, streak.y);
        grad.addColorStop(0, `rgba(${RED}, 0)`);
        grad.addColorStop(1, `rgba(255, 90, 110, 0.9)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(streak.x, streak.y);
        ctx.stroke();
        if (streak.x < -300 || streak.x > w + 300 || streak.y < -300 || streak.y > h + 300) {
          streak = null;
          nextStreakAt = clock + 4 + Math.random() * 5;
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (raf || !inView || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(draw);
      if (section) delete section.dataset.fx;
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (section) section.dataset.fx = "paused";
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    const ro = new ResizeObserver(resize);
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    stop();
    io.observe(canvas);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
