import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import TeamCard from "./TeamCard";

// One card size for every group: 4 per row on desktop, 2 on tablet, 1 on phones (24px gaps).
// Rows are flex-wrapped and centred, so a short last row (e.g. 3 of 7) sits in the middle.
// The featured card (Convenor) is 1.25× that width. Cards in a row stretch to equal heights.
const itemWidth = {
  standard: "w-full sm:w-[calc((100%_-_24px)/2)] lg:w-[calc((100%_-_72px)/4)]",
  featured: "w-full sm:w-[calc((100%_-_24px)/2*1.25)] lg:w-[calc((100%_-_72px)/4*1.25)]",
};

export default function TeamGrid({ groups }) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.id} className="pb-[var(--section-y)]">
          <Container>
            <div className="mb-10 border-b border-line pb-5">
              <h3 id={`team-${group.id}`} className="type-h3 uppercase tracking-[0.02em]">
                {group.title}
              </h3>
            </div>
            <Reveal as="ul" stagger={0.08} aria-labelledby={`team-${group.id}`} className="flex flex-wrap justify-center gap-6">
              {group.members.map((member) => (
                <li key={member.id} className={itemWidth[group.featured ? "featured" : "standard"]}>
                  <TeamCard member={member} />
                </li>
              ))}
            </Reveal>
          </Container>
        </div>
      ))}
    </>
  );
}
