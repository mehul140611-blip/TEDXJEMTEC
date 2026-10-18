import { gsap } from "@/lib/motion";

export const GRID = 10;

const { random } = gsap.utils;

/**
 * Fills `container` with GRID×GRID divs, each showing its slice of `url`.
 * Sizes are in px from the container's current box so slices line up exactly;
 * tiles overlap by half a pixel to hide seams.
 */
export function buildTiles(container, url) {
  container.replaceChildren();
  const size = container.offsetWidth;
  const step = size / GRID;
  const fragment = document.createDocumentFragment();
  const tiles = [];

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const tile = document.createElement("div");
      tile.style.cssText = [
        "position:absolute",
        `left:${col * step}px`,
        `top:${row * step}px`,
        `width:${step + 0.5}px`,
        `height:${step + 0.5}px`,
        `background-image:url("${url}")`,
        `background-size:${size}px ${size}px`,
        `background-position:${-col * step}px ${-row * step}px`,
        "will-change:transform,opacity",
      ].join(";");
      fragment.appendChild(tile);
      tiles.push(tile);
    }
  }
  container.appendChild(fragment);
  return tiles;
}

const scattered = () => ({
  x: () => random(-120, 120),
  y: () => random(-120, 120),
  rotation: () => random(-90, 90),
  scale: () => random(0.2, 0.6),
  opacity: 0,
});

/** Tiles fly apart and fade: 0.35s each, random stagger up to 0.25s (≈0.6s total). */
export function shatter(timeline, tiles, at = 0) {
  return timeline.to(
    tiles,
    { ...scattered(), duration: 0.35, ease: "power2.in", stagger: { each: 0.25 / tiles.length, from: "random" } },
    at
  );
}

/** Tiles fly in from random offsets and settle: ≈0.6s total. */
export function assemble(timeline, tiles, at = 0) {
  return timeline.fromTo(
    tiles,
    scattered(),
    {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
      stagger: { each: 0.15 / tiles.length, from: "random" },
    },
    at
  );
}
