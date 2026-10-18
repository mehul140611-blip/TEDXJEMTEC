import SectionDivider from "./SectionDivider";

/**
 * One section of the homepage scroll. `id` is the nav target ("/#speakers"); it is focusable
 * (tabIndex -1) so in-page navigation can move keyboard focus to it. The navbar offset comes
 * from `scroll-padding-top` on <html>, so native anchor jumps land below the navbar too.
 * `divider` adds the thin rule + red marker above the section (with an optional `label`);
 * `flush` drops the top padding (#home).
 */
export default function SectionShell({ id, divider = false, label, labelledBy, flush = false, children }) {
  return (
    <section id={id} aria-labelledby={labelledBy} tabIndex={-1} className={`section-target ${flush ? "" : "pt-16 lg:pt-20"}`}>
      {divider && <SectionDivider label={label} />}
      {children}
    </section>
  );
}
