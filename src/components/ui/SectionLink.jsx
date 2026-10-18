"use client";

import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";
import { isHomePath, scrollToSection, sectionFromHref } from "@/lib/sections";

/**
 * Every internal link. On "/", section links ("/#speakers", or "/" for the top) smooth-scroll in
 * place. On the separate pages (/about, /sponsors, /contact) they navigate with the page wipe
 * and land on the section.
 * `defer` waits a moment before scrolling, e.g. so the mobile menu can release its scroll lock.
 */
export default function SectionLink({ href, onClick, defer = false, children, ...rest }) {
  const pathname = usePathname();
  const section = sectionFromHref(href);

  const handleClick = (event) => {
    onClick?.(event);
    if (!section || !isHomePath(pathname)) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (defer) setTimeout(() => scrollToSection(section), 60);
    else scrollToSection(section);
  };

  return (
    <TransitionLink href={href} onClick={handleClick} {...rest}>
      {children}
    </TransitionLink>
  );
}
