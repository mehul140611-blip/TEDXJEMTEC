import Image from "next/image";
import FrameCorners from "@/components/ui/FrameCorners";
import { LinkedInIcon } from "@/components/ui/icons";
import { newTabProps } from "@/lib/a11y";

/**
 * Team member card. Styling lives here only, so a new team-page design means editing this file.
 * Square photo; name; role as the red-dot label (long roles wrap under the text, not the dot).
 * Description and LinkedIn render only when present. Hover/focus: grayscale → colour, frame corners draw in.
 * Touch screens can't hover, so there the photos are always in colour.
 */
export default function TeamCard({ member }) {
  return (
    <article className="team-card card card-interactive group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Image
          src={member.photo}
          alt={`Photo of ${member.name}`}
          width={800}
          height={800}
          className="h-full w-full object-cover object-[center_30%] grayscale transition-[filter] duration-500 group-hover:grayscale-0 group-focus-within:grayscale-0 [@media(hover:none)]:grayscale-0"
        />
        <FrameCorners tone="red" inset={14} size={24} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h4 className="text-xl font-bold">{member.name}</h4>
        <p className="accent-label type-label flex items-start text-white before:mt-[calc((1lh_-_0.5em)/2)] before:shrink-0">
          <span>
            {member.role}
            {member.department && <span className="mt-1 block">{member.department}</span>}
          </span>
        </p>
        {member.description && <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{member.description}</p>}
        {member.linkedin && (
          <a
            href={member.linkedin}
            aria-label={`${member.name} on LinkedIn`}
            className="mt-auto inline-flex h-11 w-11 items-center justify-center self-start rounded-full border border-line transition-colors hover:border-[rgba(235,0,40,0.6)]"
            {...newTabProps}
          >
            <LinkedInIcon size={18} />
          </a>
        )}
      </div>
    </article>
  );
}
