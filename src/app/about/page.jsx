import AboutSection from "@/components/sections/AboutSection";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: `About ${site.eventName}, TEDx and TED. ${site.eventDescription[1]}`,
  path: "/about/",
});

export default function AboutPage() {
  return <AboutSection />;
}
