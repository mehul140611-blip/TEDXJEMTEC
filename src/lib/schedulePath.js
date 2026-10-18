/**
 * Geometry for the schedule timeline. The curve is a sine S-wave, x(t) = 0.5 + AMP·sin(π·n·t),
 * so its peaks fall exactly at t = (2i+1)/2n: node i sits on a peak, alternating right/left.
 * Everything is a fraction of the box, so server-rendered node positions match the path the
 * client later rebuilds in real pixels.
 */

export const AMP = 0.14;
export const LINE_X = 24; // mobile: straight line 24px from the left edge

export const nodeT = (i, n) => (2 * i + 1) / (2 * n);
export const waveX = (t, n) => 0.5 + AMP * Math.sin(Math.PI * n * t);
export const nodeSide = (i) => (i % 2 === 0 ? "right" : "left");

const round = (v) => Math.round(v * 10) / 10;

// Catmull-Rom through sampled points, as cubic Béziers: smooth and exact at the samples.
function smoothPath(points) {
  let d = `M${round(points[0][0])} ${round(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
  }
  return d;
}

/** Path `d` for a box of w×h px. `mode` is "wave" (desktop) or "line" (mobile). */
export function buildPath(w, h, n, mode = "wave") {
  if (mode === "line") return `M${LINE_X} 0 L${LINE_X} ${round(h)}`;
  const steps = n * 12;
  const points = [];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    points.push([waveX(t, n) * w, t * h]);
  }
  return smoothPath(points);
}
