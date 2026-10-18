/**
 * The site's one recurring decorative idea ("Beyond the Frame"): thin L-shaped
 * corner brackets around a key element. The parent must be `position: relative`.
 */
export default function FrameCorners({ tone = "white", size, inset, className = "" }) {
  const style = {};
  if (size) style["--frame-size"] = typeof size === "number" ? `${size}px` : size;
  if (inset !== undefined) style["--frame-inset"] = typeof inset === "number" ? `${inset}px` : inset;

  return (
    <span aria-hidden="true" data-tone={tone} className={`frame-corners ${className}`} style={style}>
      <span className="fc-tl" />
      <span className="fc-tr" />
      <span className="fc-bl" />
      <span className="fc-br" />
    </span>
  );
}
