import SectionHeader from "@/components/ui/SectionHeader";
import Brand from "@/components/ui/Brand";
import TeamGrid from "./TeamGrid";
import { teamGroups } from "@/content/team";

/** #team: groups and cards come from team.js. */
export default function TeamSection() {
  return (
    <>
      <SectionHeader id="team-title" label={<Brand />} title="Team" />
      <TeamGrid groups={teamGroups} />
    </>
  );
}
