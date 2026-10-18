"use client";

import Link from "next/link";
import { useContext } from "react";
import { TransitionContext } from "@/lib/transition";

/**
 * Internal link that hands navigation to the page-wipe transition when one is
 * mounted. `onNavigate` only fires for same-origin client navigations, so
 * modifier-clicks (new tab) and external URLs behave as normal links.
 */
export default function TransitionLink({ href, children, ...rest }) {
  const transition = useContext(TransitionContext);

  return (
    <Link
      href={href}
      onNavigate={(event) => {
        if (transition?.start(href)) event.preventDefault();
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
