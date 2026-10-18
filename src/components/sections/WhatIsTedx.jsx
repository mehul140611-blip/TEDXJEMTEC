import Container from "@/components/ui/Container";
import LockedCopy from "@/components/ui/LockedCopy";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { TEDX_PROGRAM_URL, WHAT_IS_TEDX } from "@/content/lockedCopy";

/** Required TEDx block for the homepage, with a visible link to the TEDx program. */
export default function WhatIsTedx() {
  return (
    <section aria-labelledby="what-is-tedx" className="section-y bg-black">
      <Container>
        {/* Plain, readable, fade-in only. Locked headings keep their original casing. */}
        <Reveal lift={false} className="max-w-[70ch]">
          <LockedCopy
            block={WHAT_IS_TEDX}
            headingId="what-is-tedx"
            headingClassName="mb-8 text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-extrabold leading-[1.05]"
            paragraphClassName="type-body text-white"
          />
          <Button href={TEDX_PROGRAM_URL} variant="secondary" className="mt-10">
            Learn more about the TEDx program
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
