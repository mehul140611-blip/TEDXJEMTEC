/**
 * Label + heading pair. `accent` renders part of the title in red; red text is
 * only allowed at ≥ 24px, which every heading size here satisfies.
 */
export default function SectionHeading({
  as: Tag = "h2",
  label,
  title,
  accent,
  subline,
  size = "h2",
  align = "left",
  id,
  className = "",
}) {
  const sizeClass = { display: "type-display", "display-sm": "type-display-sm" }[size] ?? "type-h2";
  const alignClass = align === "center" ? "text-center items-center" : "items-start";

  return (
    <div className={`flex flex-col gap-4 ${alignClass} ${className}`}>
      {label && <p className="type-label text-muted">{label}</p>}
      <Tag id={id} className={sizeClass}>
        {title}
        {accent && <span className="text-red">{accent}</span>}
      </Tag>
      {subline && <p className="type-body max-w-[60ch] text-balance text-muted">{subline}</p>}
    </div>
  );
}
