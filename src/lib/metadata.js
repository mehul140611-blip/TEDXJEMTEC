import { site } from "@/content/site";

export const ogImage = {
  url: "/images/hero-stage.jpg",
  width: 1942,
  height: 809,
  alt: "TEDxJEMTEC stage under spotlights",
};

/** Per-page metadata: title becomes "Title | TEDxJEMTEC" via the root template. */
export function pageMetadata({ title, description, path }) {
  const fullTitle = title ? `${title} | ${site.eventName}` : undefined;
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.eventName,
      locale: "en_IN",
      url: path,
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
