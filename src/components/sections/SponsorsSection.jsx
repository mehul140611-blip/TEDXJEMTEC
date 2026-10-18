import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import Brand from "@/components/ui/Brand";
import Reveal from "@/components/ui/Reveal";
import { newTabProps } from "@/lib/a11y";

// Tile and logo caps per group. The event logo above is 64px tall (≈460px wide), so every
// sponsor logo renders smaller: featured ≤ 240×96px, partners ≤ 180×80px.
const sizes = {
  featured: { tile: "h-[200px] w-full max-w-[480px] p-8", logo: "max-h-[96px] max-w-[min(240px,100%)]" },
  standard: { tile: "aspect-[7/4] w-full p-4 sm:p-7", logo: "max-h-[min(80px,100%)] max-w-[min(180px,100%)]" },
};

// Partner grid as centred flex rows (a short last row sits in the middle): 3 per row on desktop,
// 2 on tablets and from 375px, 1 on the smallest phones.
const partnerWidth =
  "w-full min-[375px]:w-[calc((100%_-_16px)/2)] sm:w-[calc((100%_-_24px)/2)] lg:w-[calc((100%_-_48px)/3)]";

/** White tile with the logo in full colour, and the sponsor's name under it. A link only when `url` is set. */
function SponsorTile({ sponsor, featured }) {
  const size = sizes[featured ? "featured" : "standard"];
  const tile = (
    <span
      className={`flex items-center justify-center rounded-2xl border border-line bg-[#ffffff] transition-[transform,border-color] duration-300 ease-out group-hover:-translate-y-1 group-hover:border-red/40 group-focus-visible:-translate-y-1 group-focus-visible:border-red/40 ${size.tile}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic sizes vary per logo; capped by CSS */}
      <img src={sponsor.logo} alt={sponsor.name} loading="lazy" className={`h-auto w-auto object-contain ${size.logo}`} />
    </span>
  );
  const name = (
    <span aria-hidden="true" className="mt-3 block text-center text-sm text-muted">
      {sponsor.name}
    </span>
  );

  if (!sponsor.url) {
    return (
      <div className="group">
        {tile}
        {name}
      </div>
    );
  }
  return (
    <a href={sponsor.url} className="group block" {...newTabProps}>
      {tile}
      {name}
    </a>
  );
}

/**
 * /sponsors: the only place sponsor names or logos may appear. Groups come from `sponsorTiers`:
 * a featured tile per sponsor (Ticketing Partner), then a 3-column grid (2 on tablets and at
 * ≥ 375px, 1 on the smallest phones). Tiles stagger in on scroll.
 */
export default function SponsorsSection({ sponsors, tiers }) {
  const groups = tiers
    .map((t) => ({ ...t, items: sponsors.filter((s) => s.tier === t.tier) }))
    .filter((g) => g.items.length > 0);

  return (
    <section
      aria-labelledby="sponsors-title"
      className="relative overflow-hidden pb-[var(--section-y)] pt-[calc(var(--nav-h)+80px)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(235,0,40,0.18),transparent_60%)]"
      />
      <Container className="relative flex flex-col items-center text-center">
        <Logo eager className="h-16 w-auto" />
        <p className="type-label mt-10 text-muted">
          <Brand suffix=" 2026" />
        </p>
        <h1
          id="sponsors-title"
          className="mt-4 text-[clamp(2.5rem,0.8rem+5.5vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.02em]"
        >
          Sponsors &amp; Partners
        </h1>

        {groups.map((group) => (
          <div key={group.tier} className="mt-16 w-full">
            <h2 className="type-label mb-8 text-muted">{group.title}</h2>
            <Reveal
              as="ul"
              stagger={0.08}
              className={
                group.featured
                  ? "flex flex-col items-center gap-6"
                  : "mx-auto flex max-w-[888px] flex-wrap justify-center gap-4 sm:gap-6"
              }
            >
              {group.items.map((sponsor) => (
                <li key={sponsor.id} className={group.featured ? "w-full max-w-[480px]" : partnerWidth}>
                  <SponsorTile sponsor={sponsor} featured={group.featured} />
                </li>
              ))}
            </Reveal>
          </div>
        ))}
      </Container>
    </section>
  );
}
