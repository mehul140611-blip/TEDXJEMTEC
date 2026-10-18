import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
import ScheduleTimeline from "./ScheduleTimeline";
import { schedule } from "@/content/schedule";

/** #schedule: header and the scroll-drawn path timeline. */
export default function ScheduleSection() {
  return (
    <>
      <SectionHeader id="schedule-title" size="display-sm" title="Schedule" subline="Scroll to explore the day" />
      <Container className="pb-[var(--section-y)]" data-loops="">
        <ScheduleTimeline sessions={schedule} />
      </Container>
    </>
  );
}
