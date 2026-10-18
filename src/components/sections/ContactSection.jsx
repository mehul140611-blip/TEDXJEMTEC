import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import RegisterButton from "@/components/ui/RegisterButton";
import SectionHeader from "@/components/ui/SectionHeader";
import Brand from "@/components/ui/Brand";
import Reveal from "@/components/ui/Reveal";
import VenueMap from "@/components/ui/VenueMap";
import { InstagramIcon, LinkedInIcon, MailIcon, PhoneIcon } from "@/components/ui/icons";
import { site } from "@/content/site";

const bigLink =
  "text-link inline-flex min-h-11 items-center gap-3 self-start break-all text-[clamp(1.125rem,0.9rem+0.8vw,1.5rem)] font-bold";

/** /contact page content ("Contact Us"): details only, no contact form. */
export default function ContactSection() {
  return (
    <>
      <SectionHeader as="h1" page id="contact-title" label={<Brand />} title="Contact Us" />
      <Container className="pb-[var(--section-y)]">
        <Reveal stagger={0.08} className="grid gap-5 md:grid-cols-2">
          <div className="card flex flex-col gap-3 p-7">
            <h2 className="type-label text-muted">Email &amp; phone</h2>
            <a href={`mailto:${site.email}`} className={bigLink}>
              <MailIcon size={22} />
              {site.email}
            </a>
            <a href={site.phoneHref} className={bigLink} aria-label={`Call TEDxJEMTEC at ${site.phone}`}>
              <PhoneIcon size={22} />
              {site.phone}
            </a>
          </div>

          <div className="card flex flex-col gap-4 p-7">
            <h2 className="type-label text-muted">Follow</h2>
            <div className="flex flex-wrap gap-3">
              <Button href={site.linkedin} variant="secondary" aria-label="TEDxJEMTEC on LinkedIn">
                <LinkedInIcon size={18} /> LinkedIn
              </Button>
              <Button href={site.instagram} variant="secondary" aria-label="TEDxJEMTEC on Instagram">
                <InstagramIcon size={18} /> Instagram
              </Button>
            </div>
          </div>

          <div className="card flex flex-col items-start gap-4 p-7">
            <h2 className="type-label text-muted">Venue</h2>
            <address className="not-italic">
              <span className="type-h3 block">{site.venueName}</span>
              <span className="mt-2 block text-[0.9375rem] leading-relaxed text-muted">{site.venueAddress}</span>
            </address>
          </div>

          <div className="card flex flex-col items-start gap-4 p-7">
            <h2 className="type-label text-muted">Register</h2>
            <p className="text-[0.9375rem] leading-relaxed text-muted">
              Registration and tickets are handled through our registration app. Price and entry details are shown there.
            </p>
            <RegisterButton />
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <VenueMap />
        </Reveal>
      </Container>
    </>
  );
}
