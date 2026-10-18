import SectionHeader from "@/components/ui/SectionHeader";
import Brand from "@/components/ui/Brand";
import LockedCopy from "@/components/ui/LockedCopy";
import AboutBlock from "./AboutBlock";
import { ABOUT_TED, ABOUT_TEDX } from "@/content/lockedCopy";
import { site } from "@/content/site";

const facts = [
  { label: "Date", value: <time dateTime={site.dateISO}>{site.dateLabel}</time> },
  { label: "Venue", value: site.venueName, note: site.venueAddress },
];

/** /about page content: our event, then the locked About TEDx and About TED copy (unchanged). */
export default function AboutSection() {
  return (
    <>
      <SectionHeader as="h1" page id="about-title" label={<Brand />} title="About" />

      <AboutBlock id="about-event" heading="About our event">
        <p className="type-label text-muted">
          <Brand suffix=" 2026" /> · The theme
        </p>
        <p className="font-theme-line mt-4 text-[clamp(2.5rem,1.6rem+3vw,4rem)] leading-[1]">{site.theme}</p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em]">{site.themeSubtitle}</p>
        <div className="type-body mt-8 flex flex-col gap-2">
          {site.eventDescription.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <dl className="mt-10 grid gap-5 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="card p-6">
              <dt className="type-label text-muted">{fact.label}</dt>
              <dd className="mt-2 text-lg font-bold">{fact.value}</dd>
              {fact.note && <dd className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{fact.note}</dd>}
            </div>
          ))}
        </dl>
      </AboutBlock>

      <AboutBlock id="about-tedx" heading={ABOUT_TEDX.heading} locked>
        <LockedCopy block={ABOUT_TEDX} showHeading={false} paragraphClassName="type-body" />
      </AboutBlock>

      <AboutBlock id="about-ted" heading={ABOUT_TED.heading} locked>
        <LockedCopy block={ABOUT_TED} showHeading={false} className="flex flex-col gap-6" paragraphClassName="type-body" />
      </AboutBlock>
    </>
  );
}
