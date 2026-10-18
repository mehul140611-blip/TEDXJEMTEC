import { InstagramIcon, LinkedInIcon, MailIcon } from "./icons";
import { site } from "@/content/site";
import { newTabProps } from "@/lib/a11y";

const iconLink =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-white transition-[border-color,transform] duration-300 hover:scale-[1.03] hover:border-[rgba(235,0,40,0.6)]";

/** Email, LinkedIn and Instagram as icon buttons. */
export default function SocialLinks({ withEmail = true, className = "" }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {withEmail && (
        <li>
          <a href={`mailto:${site.email}`} className={iconLink} aria-label={`Email ${site.email}`}>
            <MailIcon />
          </a>
        </li>
      )}
      <li>
        <a href={site.linkedin} className={iconLink} aria-label="TEDxJEMTEC on LinkedIn" {...newTabProps}>
          <LinkedInIcon />
        </a>
      </li>
      <li>
        <a href={site.instagram} className={iconLink} aria-label="TEDxJEMTEC on Instagram" {...newTabProps}>
          <InstagramIcon />
        </a>
      </li>
    </ul>
  );
}
