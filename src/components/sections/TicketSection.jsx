import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ParticleField from "./ParticleField";
import TicketCard from "./TicketCard";

export default function TicketSection() {
  return (
    <section aria-labelledby="register-title" className="section-y relative isolate overflow-hidden bg-black">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(138,0,24,0.45),transparent_65%)]" />
        <div className="ring-glow -left-[260px] top-[18%] h-[520px] w-[520px]" />
        <div className="ring-glow -right-[300px] top-[34%] h-[600px] w-[600px] [animation-direction:reverse]" />
        <div className="ring-glow -top-[220px] left-[55%] hidden h-[380px] w-[380px] opacity-60 md:block" />
        <ParticleField />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <Container>
        <Reveal className="text-center">
          <SectionHeading
            id="register-title"
            align="center"
            title="Regis"
            accent="ter"
            subline="Registration and tickets are handled through our registration app. Price and entry details are shown there."
          />
        </Reveal>

        <Reveal className="mt-14">
          <TicketCard />
        </Reveal>

        <p className="tilt-hint type-label mt-8 text-center text-muted">Move your pointer over the ticket</p>
      </Container>
    </section>
  );
}
