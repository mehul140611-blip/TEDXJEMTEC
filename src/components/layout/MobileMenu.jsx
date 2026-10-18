"use client";

import { useEffect, useRef } from "react";
import SectionLink from "@/components/ui/SectionLink";
import RegisterButton from "@/components/ui/RegisterButton";
import SocialLinks from "@/components/ui/SocialLinks";
import { gsap, useGSAP, ease, prefersReducedMotion } from "@/lib/motion";
import { nav, site } from "@/content/site";
import { DESKTOP_NAV_QUERY } from "@/lib/nav";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusablesIn(root) {
  return [...root.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden"
  );
}

/**
 * Full-screen menu below the desktop nav breakpoint. Rendered inside the header so the
 * logo and toggle stay on top; focus is trapped within the header while it is open.
 */
export default function MobileMenu({ id, open, onClose, current, containerRef, toggleRef }) {
  const panelRef = useRef(null);
  const restoreFocus = useRef(true);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const items = panel.querySelectorAll("[data-menu-item]");
      const reduce = prefersReducedMotion();

      if (!open) {
        gsap.to(panel, { autoAlpha: 0, duration: reduce ? 0 : 0.25, overwrite: "auto" });
        return;
      }
      // Visible synchronously so the effect below can move focus into the panel.
      gsap.set(panel, { visibility: "inherit" });
      if (reduce) {
        gsap.set(panel, { opacity: 1 });
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      gsap.to(panel, { opacity: 1, duration: 0.3, overwrite: "auto" });
      gsap.fromTo(
        items,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.08, ease: ease.out, overwrite: "auto" }
      );
    },
    { dependencies: [open], scope: panelRef }
  );

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    const toggle = toggleRef.current;
    const root = document.documentElement;
    restoreFocus.current = true;

    // Everything outside the header becomes inert while the menu covers the page.
    const outside = [...document.body.children].filter((el) => !el.contains(container));
    outside.forEach((el) => (el.inert = true));
    root.dataset.scrollLocked = "";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusablesIn(container);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia(DESKTOP_NAV_QUERY);
    const onDesktop = (e) => e.matches && onClose();

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    panelRef.current.querySelector("a[href]")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      outside.forEach((el) => (el.inert = false));
      delete root.dataset.scrollLocked;
      if (restoreFocus.current) toggle?.focus();
    };
  }, [open, onClose, containerRef, toggleRef]);

  const onLinkClick = () => {
    restoreFocus.current = false;
    onClose();
  };

  return (
    <div
      ref={panelRef}
      id={id}
      className="invisible fixed inset-0 z-0 overflow-y-auto bg-black opacity-0 nav:hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(235,0,40,0.22),transparent_55%)]"
      />
      <div className="container-site relative flex min-h-full flex-col pb-10 pt-[calc(var(--nav-h)+28px)]">
        <nav aria-label="Mobile">
          <ul className="flex flex-col">
            {nav.map((item) => {
              const state = current(item);
              return (
                <li key={item.href} data-menu-item>
                  {/* Tapping closes the menu first, then scrolls (defer lets the scroll lock lift). */}
                  <SectionLink
                    href={item.href}
                    onClick={onLinkClick}
                    defer
                    aria-current={state}
                    className={`inline-block py-1.5 text-[clamp(2.25rem,9vw,3.5rem)] font-extrabold uppercase leading-[1.05] tracking-[-0.01em] transition-colors ${
                      state
                        ? "text-white underline decoration-red decoration-2 underline-offset-8"
                        : "text-muted hover:text-white"
                    }`}
                  >
                    {item.label}
                  </SectionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div data-menu-item className="mt-10">
          <RegisterButton size="lg" />
        </div>

        <div data-menu-item className="mt-auto flex flex-col gap-3 border-t border-line pt-8">
          <a href={`mailto:${site.email}`} className="text-link type-body inline-flex min-h-11 items-center self-start">
            {site.email}
          </a>
          <a
            href={site.phoneHref}
            aria-label={`Call TEDxJEMTEC at ${site.phone}`}
            className="text-link type-body inline-flex min-h-11 items-center self-start"
          >
            {site.phone}
          </a>
          <SocialLinks withEmail={false} />
        </div>
      </div>
    </div>
  );
}
