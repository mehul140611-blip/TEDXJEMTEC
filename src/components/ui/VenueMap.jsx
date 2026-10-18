import Image from "next/image";
import Button from "./Button";
import { site } from "@/content/site";

// Shared frame for the photo and the map: same radius, border and size.
const frame =
  "overflow-hidden rounded-2xl border border-line bg-surface-2 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[420px]";

/**
 * Venue block: the auditorium photo (left) next to the Google Map (right) from 1024px,
 * stacked below that (photo first). The map keeps its dark treatment and full-colour link.
 */
export default function VenueMap({ className = "" }) {
  return (
    <div className={`grid gap-6 lg:grid-cols-2 ${className}`}>
      <figure className="flex flex-col gap-3">
        <div className={`venue-frame ${frame}`}>
          <Image
            src="/images/venue-auditorium.jpg"
            alt="The JEMTEC auditorium, venue of TEDxJEMTEC"
            width={1600}
            height={830}
            loading="lazy"
            className="venue-photo h-full w-full object-cover object-[center_40%]"
          />
        </div>
        <figcaption className="text-sm text-muted">Auditorium, JEMTEC, Greater Noida</figcaption>
      </figure>

      <div className="flex flex-col items-start gap-3">
        {/* Focus lands inside the embedded map, so the ring is drawn on this wrapper where supported. */}
        <div className={`w-full ${frame} focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-white`}>
          <iframe
            src={site.mapEmbedSrc}
            title="Map: Auditorium, JEMTEC, Greater Noida"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="map-dark h-full w-full border-0"
          />
        </div>
        <Button href={site.mapLinkUrl} variant="secondary" size="sm">
          Open in Google Maps
        </Button>
      </div>
    </div>
  );
}
