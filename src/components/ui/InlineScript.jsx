/**
 * A script that runs once during HTML parsing (before hydration) and is inert on
 * client renders. See Next's "Preventing flash before hydration" guide.
 */
export default function InlineScript({ html }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
