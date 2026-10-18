import Image from "next/image";

/**
 * The official TEDxJEMTEC logo. It may only be scaled or faded as a whole:
 * set the height via `className` and keep `w-auto` so the ratio never changes.
 */
export default function Logo({ className = "h-8 w-auto", alt = "TEDxJEMTEC", eager = false }) {
  return (
    <Image
      src="/brand/tedxjemtec-logo.png"
      alt={alt}
      width={1647}
      height={229}
      className={className}
      loading={eager ? "eager" : "lazy"}
      draggable={false}
    />
  );
}
