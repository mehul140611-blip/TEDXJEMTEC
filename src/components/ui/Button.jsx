import SectionLink from "./SectionLink";
import { newTabProps } from "@/lib/a11y";

const sizes = { sm: "btn-sm", md: "", lg: "btn-lg" };
const variants = { primary: "btn-primary", secondary: "btn-secondary", disabled: "btn-disabled" };

export function buttonClasses({ variant = "primary", size = "md", className = "" } = {}) {
  return ["btn", sizes[size], variants[variant], className].filter(Boolean).join(" ");
}

/**
 * Internal href → SectionLink (scroll or wipe), external http(s) → new tab, mailto/tel → plain link,
 * no href → <button>.
 */
export default function Button({ href, variant, size, className, children, ...rest }) {
  const classes = buttonClasses({ variant, size, className });

  if (!href) {
    return (
      <button type="button" className={classes} {...rest}>
        {children}
      </button>
    );
  }

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={classes} {...newTabProps} {...rest}>
        {children}
      </a>
    );
  }

  if (/^(mailto|tel):/.test(href)) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <SectionLink href={href} className={classes} {...rest}>
      {children}
    </SectionLink>
  );
}
