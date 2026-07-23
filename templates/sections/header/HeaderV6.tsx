"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { HeaderSectionProps } from "@/types";
import { SiteLink, useSiteNav } from "../../nav/SiteNavContext";

/** HeaderV6 — Atelier: centered logo above a hairline nav deck, boutique style. */
export default function HeaderV6({ data }: HeaderSectionProps) {
  // The menu is derived from the site's pages — add a page, get a link.
  const { links, homeLink, activePageId } = useSiteNav();
  const [isOpen, setIsOpen] = useState(false);

  const logo = data?.logoImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={data.logoImage}
      alt={data?.logoText || "Logo"}
      className="h-10 object-contain"
    />
  ) : (
    <span className="text-xl uppercase tracking-[0.2em] [font-family:var(--site-font-heading)]">
      {data?.logoText || "Your Studio"}
    </span>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--site-foreground)]/10 bg-[var(--site-background)]/95 backdrop-blur">
      {/* Thin brand keyline across the very top */}
      <div className="h-0.5 w-full bg-[var(--site-accent)]" />

      <div className="mx-auto max-w-6xl px-6">
        {/* Desktop: centered logo, hairline rule, centered menu underneath */}
        <div className="hidden md:block">
          <div className="flex justify-center py-5">
            {homeLink ? <SiteLink link={homeLink}>{logo}</SiteLink> : logo}
          </div>
          <nav className="flex justify-center gap-10 border-t border-[color:var(--site-foreground)]/10 py-3">
            {links.map((link) => {
              const isActive = link.pageId === activePageId;

              return (
                <SiteLink
                  key={link.pageId}
                  link={link}
                  className={`text-xs font-semibold uppercase tracking-[0.25em] transition ${
                    isActive
                      ? "text-[color:var(--site-accent)]"
                      : "text-[color:var(--site-foreground)]/70 hover:text-[color:var(--site-accent)]"
                  }`}
                >
                  {link.label}
                </SiteLink>
              );
            })}
          </nav>
        </div>

        {/* Mobile: logo left, menu toggle right */}
        <div className="flex items-center justify-between py-4 md:hidden">
          {homeLink ? <SiteLink link={homeLink}>{logo}</SiteLink> : logo}
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((open) => !open)}
            className="text-[color:var(--site-foreground)] transition hover:text-[color:var(--site-accent)]"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <nav className="border-t border-[color:var(--site-foreground)]/10 md:hidden">
          {links.map((link) => {
            const isActive = link.pageId === activePageId;

            return (
              <SiteLink
                key={link.pageId}
                link={link}
                onClick={() => setIsOpen(false)}
                className={`block w-full px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] transition ${
                  isActive
                    ? "bg-[var(--site-muted)] text-[color:var(--site-accent)]"
                    : "text-[color:var(--site-foreground)]/70 hover:bg-[var(--site-muted)] hover:text-[color:var(--site-accent)]"
                }`}
              >
                {link.label}
              </SiteLink>
            );
          })}
        </nav>
      )}
    </header>
  );
}
