import SectionLink from "@/components/ui/SectionLink";
import SocialLinks from "@/components/ui/SocialLinks";
import Logo from "@/components/ui/Logo";
import { FOOTER_LICENSE_STATEMENT, TEDX_PROGRAM_URL } from "@/content/lockedCopy";
import { nav, site } from "@/content/site";
import { newTabProps } from "@/lib/a11y";

// No sponsor or partner content may appear here (TEDx rule).
export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(235,0,40,0.14),transparent_55%)]"
      />
      <div className="container-site relative pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <SectionLink href="/" className="flex min-h-11 items-center self-start">
              <Logo className="h-8 w-auto" />
            </SectionLink>
            <p className="type-label text-muted">
              {site.dateLabel} · {site.venueName}
            </p>
            <a href={TEDX_PROGRAM_URL} className="text-link inline-flex min-h-11 items-center self-start text-[0.9375rem]" {...newTabProps}>
              Learn more about the TEDx program
            </a>
          </div>

          <nav aria-label="Footer">
            <h2 className="type-label mb-4 text-muted">Explore</h2>
            <ul className="grid grid-cols-2 gap-x-6 md:grid-cols-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <SectionLink href={item.href} className="nav-link text-[0.9375rem]">
                    {item.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="type-label mb-4 text-muted">Connect</h2>
            <div className="flex flex-col items-start">
              <a href={`mailto:${site.email}`} className="text-link inline-flex min-h-11 items-center break-all text-[0.9375rem]">
                {site.email}
              </a>
              <a
                href={site.phoneHref}
                aria-label={`Call TEDxJEMTEC at ${site.phone}`}
                className="text-link inline-flex min-h-11 items-center text-[0.9375rem]"
              >
                {site.phone}
              </a>
            </div>
            <SocialLinks withEmail={false} className="mt-5" />
          </div>

          <div>
            <h2 className="type-label mb-4 text-muted">Venue</h2>
            <address className="text-[0.9375rem] not-italic leading-relaxed">
              <span className="block font-semibold text-white">{site.venueName}</span>
              <span className="block text-muted">{site.venueAddress}</span>
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-sm text-white md:flex-row md:items-center md:justify-between">
          <p>{FOOTER_LICENSE_STATEMENT}</p>
          <p>© 2026 TEDxJEMTEC</p>
        </div>
      </div>
    </footer>
  );
}
