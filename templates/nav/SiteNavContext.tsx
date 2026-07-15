"use client";

/**
 * ============================================================================
 * SITE NAV CONTEXT — Gives every header variant its menu, without prop drilling
 * ============================================================================
 *
 * The header variants (HeaderV1…V5) all need the same three things: the list of
 * menu links, which one is active, and what a click should DO. That last part
 * differs by where the site is being rendered:
 *
 *   - PUBLISHED SITE / standalone preview → a click is a real navigation.
 *     Render a Next.js <Link> so we get prefetching and client-side transitions.
 *
 *   - DASHBOARD LIVE PREVIEW → the site is rendered inside the editor, not at
 *     its own URL. A real navigation would yank the user out of the dashboard,
 *     so a click instead switches which page the preview is showing.
 *
 * Variants don't need to know which mode they're in: they just render <SiteLink>
 * and it does the right thing.
 */

import { createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import type { NavLink } from "@/types";

type NavMode = "route" | "preview";

interface SiteNavValue {
  /** The menu links, already resolved against the current base path. */
  links: NavLink[];
  /**
   * The home page as a link — headers wire this to the logo. It exists even if
   * the user hid Home from the menu, so clicking the logo always works.
   */
  homeLink: NavLink | null;
  /** The page currently being displayed. */
  activePageId: string | null;
  /** "route" → real navigation; "preview" → switch the previewed page. */
  mode: NavMode;
  /** Only used in preview mode. */
  onNavigate?: (pageId: string) => void;
}

const SiteNavContext = createContext<SiteNavValue>({
  links: [],
  homeLink: null,
  activePageId: null,
  mode: "route",
});

export function SiteNavProvider({
  value,
  children,
}: {
  value: SiteNavValue;
  children: ReactNode;
}) {
  return (
    <SiteNavContext.Provider value={value}>{children}</SiteNavContext.Provider>
  );
}

/** The menu links + active page, for header variants to render. */
export function useSiteNav(): SiteNavValue {
  return useContext(SiteNavContext);
}

/**
 * A single menu link. Renders a real <Link> on the published site and a plain
 * <button> in the dashboard preview — same markup and styling either way, so
 * variants style it exactly like they'd style an anchor.
 */
export function SiteLink({
  link,
  className,
  onClick,
  children,
}: {
  link: NavLink;
  className?: string;
  /** Extra side effect on click, e.g. closing the mobile drawer. */
  onClick?: () => void;
  children: ReactNode;
}) {
  const { mode, onNavigate } = useSiteNav();

  if (mode === "preview") {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          onNavigate?.(link.pageId);
          onClick?.();
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
