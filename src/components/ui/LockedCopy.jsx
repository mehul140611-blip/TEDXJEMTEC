import { Fragment } from "react";
import { newTabProps } from "@/lib/a11y";

/**
 * Renders a block from content/lockedCopy.js exactly as written.
 * Never transform `text` here (no trimming, casing or splitting).
 */
export default function LockedCopy({
  block,
  headingLevel = 2,
  showHeading = true,
  headingId,
  headingClassName = "",
  className = "",
  paragraphClassName = "",
}) {
  const Heading = `h${headingLevel}`;

  return (
    <div className={className}>
      {showHeading && (
        <Heading id={headingId} className={headingClassName}>
          {block.heading}
        </Heading>
      )}
      {block.paragraphs.map((segments, p) => (
        <p key={p} className={paragraphClassName}>
          {segments.map((segment, s) =>
            segment.href ? (
              <a key={s} href={segment.href} className="locked-link" {...newTabProps}>
                {segment.text}
              </a>
            ) : (
              <Fragment key={s}>{segment.text}</Fragment>
            )
          )}
        </p>
      ))}
    </div>
  );
}
