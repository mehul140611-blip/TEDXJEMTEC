import { site } from "@/content/site";

/**
 * The event name, protected from `text-transform`. TEDx branding keeps the lowercase
 * "x", so uppercase labels must never turn it into "TEDXJEMTEC".
 */
export default function Brand({ suffix = "" }) {
  return (
    <span className="normal-case">
      {site.eventName}
      {suffix}
    </span>
  );
}
