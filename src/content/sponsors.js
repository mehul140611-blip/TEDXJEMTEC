/**
 * Sponsors and partners. Shown ONLY on /sponsors (TEDx rule: never on the homepage,
 * footer, navbar or page headers).
 *
 * Shape: { id, name, logo, url, tier }
 *   logo  path under /public; transparent or white-background PNG/WebP/SVG. Shown in full colour
 *         on a white tile, always smaller than the event logo (featured ≤ 240×96px, others ≤ 180×80px).
 *   url   the partner's website (the tile becomes a link opening in a new tab), or null
 *   tier  one of the `tier` values in `sponsorTiers` below
 *
 * Wording on the page stays neutral: partners support the event, they do not organize it.
 */

/** Page groups, in order. `featured`: one wide centred tile per sponsor instead of the grid. */
export const sponsorTiers = [
  { tier: "Ticketing Partner", title: "Ticketing Partner", featured: true },
  { tier: "Partner", title: "Partners" },
];

export const sponsors = [
  { id: "kqeek", name: "Kqeek", logo: "/sponsors/kqeek.png", url: null, tier: "Ticketing Partner" },
  { id: "dominos", name: "Domino's", logo: "/sponsors/dominos.png", url: null, tier: "Partner" },
  { id: "books-tycoon", name: "Books Tycoon", logo: "/sponsors/books-tycoon.png", url: null, tier: "Partner" },
  { id: "vardiano", name: "Vardiano", logo: "/sponsors/vardiano.png", url: null, tier: "Partner" },
  { id: "perfume-theka", name: "The Perfume Theka", logo: "/sponsors/perfume-theka.png", url: null, tier: "Partner" },
  { id: "shekunj", name: "Shekunj Education", logo: "/sponsors/shekunj.png", url: null, tier: "Partner" },
];
