import Button, { buttonClasses } from "./Button";
import { site } from "@/content/site";

/**
 * The only Register button on the site. Links out to `site.registerUrl` in a new tab
 * (Button adds target="_blank" rel="noopener noreferrer"). Wording is always "Register",
 * never a price. TEDx rule: no ticketing-partner name on the button or around it.
 */
export default function RegisterButton({ size = "md", className = "" }) {
  if (site.registerUrl) {
    return (
      <Button href={site.registerUrl} size={size} className={className}>
        Register
      </Button>
    );
  }

  // No URL yet: stays focusable so keyboard and screen-reader users still learn the status.
  return (
    <button
      type="button"
      aria-disabled="true"
      className={buttonClasses({ variant: "disabled", size, className })}
    >
      Registration opens soon
    </button>
  );
}
