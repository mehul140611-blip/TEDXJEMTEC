import ContactSection from "@/components/sections/ContactSection";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: `Contact ${site.eventName}: ${site.email}, ${site.phone}. ${site.venueName}, ${site.venueAddress}.`,
  path: "/contact/",
});

export default function ContactPage() {
  return <ContactSection />;
}
