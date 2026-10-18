import SponsorsSection from "@/components/sections/SponsorsSection";
import { sponsors, sponsorTiers } from "@/content/sponsors";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Sponsors",
  description: `Sponsors and partners of ${site.eventName} 2026.`,
  path: "/sponsors/",
});

export default function SponsorsPage() {
  return <SponsorsSection sponsors={sponsors} tiers={sponsorTiers} />;
}
