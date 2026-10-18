import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import VenueMap from "@/components/ui/VenueMap";
import { site, startTimeText } from "@/content/site";

const details = [
  {
    label: "Date",
    value: <time dateTime={site.dateISO}>{site.dateLabel}</time>,
  },
  {
    label: "Venue",
    value: site.venueName,
    note: site.venueAddress,
  },
  { label: "Time", value: startTimeText },
];

export default function EventDetails() {
  return (
    <section aria-labelledby="details-title" className="section-y bg-surface">
      <Container>
        <Reveal>
          <SectionHeading id="details-title" label={site.dateDecorative} title="Event details" />
        </Reveal>

        <Reveal as="dl" stagger={0.1} className="mt-14 grid gap-5 md:grid-cols-3">
          {details.map((item) => (
            <div key={item.label} className="card card-interactive flex flex-col gap-3 p-7">
              <dt className="type-label text-muted">{item.label}</dt>
              <dd className="type-h3">{item.value}</dd>
              {item.note && <dd className="text-[0.9375rem] leading-relaxed text-muted">{item.note}</dd>}
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-16">
          <VenueMap />
        </Reveal>
      </Container>
    </section>
  );
}
