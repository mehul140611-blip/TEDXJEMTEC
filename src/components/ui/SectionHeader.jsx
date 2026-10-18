import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/**
 * Large heading at the top of a section or page. On the homepage it is an h2 (the only h1 is
 * in the hero); separate pages (/about, /contact) pass `as="h1"` and `page` to clear the navbar.
 * `size` is passed to SectionHeading (e.g. "display-sm" for a smaller display heading).
 */
export default function SectionHeader({ id, as = "h2", page = false, size = "display", label, title, subline, children }) {
  const spacing = page ? "pb-14 pt-[calc(var(--nav-h)+88px)]" : "pb-14 pt-12 lg:pt-16";
  return (
    <Container className={`relative ${spacing}`}>
      <Reveal>
        <SectionHeading as={as} id={id} size={size} label={label} title={title} subline={subline} />
        {children}
      </Reveal>
    </Container>
  );
}
