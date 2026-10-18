import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

/**
 * Editorial row on the About page: a large heading on the left (sticky from 1024px)
 * and text on the right, max 70ch. `locked` blocks (TEDx copy) fade in without lifting.
 */
export default function AboutBlock({ id, heading, locked = false, children }) {
  return (
    <div className="border-t border-line py-[calc(var(--section-y)*0.75)]">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal lift={!locked} className="lg:sticky lg:top-[calc(var(--nav-h)+40px)] lg:self-start">
          {/* No uppercase transform: locked headings must keep their original casing. */}
          <h2 id={id} className="text-[clamp(1.875rem,1.1rem+2.2vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.01em]">
            {heading}
          </h2>
        </Reveal>
        <Reveal lift={!locked} className="max-w-[70ch]">
          {children}
        </Reveal>
      </Container>
    </div>
  );
}
