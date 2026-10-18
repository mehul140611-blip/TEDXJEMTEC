"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import SectionLink from "@/components/ui/SectionLink";
import RegisterButton from "@/components/ui/RegisterButton";
import Logo from "@/components/ui/Logo";
import MobileMenu from "./MobileMenu";
import { nav } from "@/content/site";
import { DESKTOP_NAV_QUERY, navCurrent, useActiveSection } from "@/lib/nav";
import { isHomePath } from "@/lib/sections";

const SOLID_AFTER = 80;

export default function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const onHome = isHomePath(pathname);
  const activeSection = useActiveSection(onHome);
  const current = (item) => navCurrent(item, { onHome, activeSection, pathname });

  // Solid after 80px; on desktop, hide while scrolling down and reveal on scroll up.
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_NAV_QUERY);
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const focusInside = headerRef.current?.contains(document.activeElement);
      // Stay visible during section jumps so the landing offset matches what the visitor sees.
      const autoScroll = "autoScroll" in document.documentElement.dataset;
      setSolid(y > SOLID_AFTER);
      if (!desktop.matches || y <= SOLID_AFTER || focusInside || autoScroll) setHidden(false);
      else if (Math.abs(y - lastY) > 4) setHidden(y > lastY);
      lastY = y;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      ref={headerRef}
      onFocusCapture={() => setHidden(false)}
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out)]"
      style={{ transform: hidden && !menuOpen ? "translateY(-100%)" : "none" }}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border-b border-line bg-black/80 backdrop-blur-[12px] transition-opacity duration-300 ${
          solid && !menuOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="container-site relative z-10 flex h-[var(--nav-h)] items-center justify-between gap-6">
        <SectionLink href="/" className="flex min-h-11 shrink-0 items-center" onClick={closeMenu} defer={menuOpen}>
          <Logo eager className="h-[26px] w-auto nav:h-8" />
        </SectionLink>

        <nav aria-label="Main" className="hidden nav:block">
          <ul className="flex items-center gap-5 xl:gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <SectionLink href={item.href} className="nav-link text-sm font-medium" aria-current={current(item)}>
                  {item.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 nav:block">
          <RegisterButton size="sm" />
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="relative -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full nav:hidden"
        >
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span
              className={`absolute left-0 top-0 h-[2px] w-6 bg-white transition-transform duration-300 ${
                menuOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[2px] w-6 bg-white transition-transform duration-300 ${
                menuOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <MobileMenu
        id="mobile-menu"
        open={menuOpen}
        onClose={closeMenu}
        current={current}
        containerRef={headerRef}
        toggleRef={toggleRef}
      />
    </header>
  );
}
