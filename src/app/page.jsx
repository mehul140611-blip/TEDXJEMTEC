import { preload } from "react-dom";
import SectionShell from "@/components/ui/SectionShell";
import HomeLanding from "@/components/layout/HomeLanding";
import Hero from "@/components/sections/Hero";
import ThemeSection from "@/components/sections/ThemeSection";
import EventDetails from "@/components/sections/EventDetails";
import WhatIsTedx from "@/components/sections/WhatIsTedx";
import TicketSection from "@/components/sections/TicketSection";
import SpeakerReveal from "@/components/sections/SpeakerReveal";
import ScheduleSection from "@/components/sections/ScheduleSection";
import TeamSection from "@/components/sections/TeamSection";
import { speakers } from "@/content/speakers";
import { metaDescription, site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({
    description: metaDescription,
    path: "/",
  }),
  title: { absolute: `${site.eventName} — ${site.theme}` },
};

/**
 * The homepage scroll: Home → Speakers → Schedule → Team; navbar links scroll to these ids.
 * About, Sponsors and Contact Us are separate pages. No sponsor content here (TEDx rule), and
 * "What is TEDx?" must stay on this page (TEDx rule).
 */
export default function HomePage() {
  preload("/images/hero-stage.webp", { as: "image", type: "image/webp", fetchPriority: "high" });

  return (
    <>
      <HomeLanding />

      <SectionShell id="home" labelledBy="hero-title" flush>
        <Hero />
        <ThemeSection />
        <EventDetails />
        <WhatIsTedx />
        <TicketSection />
      </SectionShell>

      {/* Divider labels are omitted where they would only repeat the heading right below. */}
      <SectionShell id="speakers" divider label="Speakers" labelledBy="speaker-reveal-title">
        <SpeakerReveal speakers={speakers} />
      </SectionShell>

      <SectionShell id="schedule" divider labelledBy="schedule-title">
        <ScheduleSection />
      </SectionShell>

      <SectionShell id="team" divider labelledBy="team-title">
        <TeamSection />
      </SectionShell>
    </>
  );
}
