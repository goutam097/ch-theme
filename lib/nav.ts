/**
 * ============================================================================
 * NAVIGATION — The menu is DERIVED from the pages, never stored separately.
 * ============================================================================
 *
 * This is the core of the dynamic menu: there is no menu list to keep in sync.
 * A page with `showInMenu: true` IS a menu item. Add a page → the link appears
 * in every header variant, on every template, in the preview and on the
 * published site, with no further wiring.
 */

import type { NavLink, SitePage } from "@/types";

/**
 * Build the href for a page under a given base path.
 *
 * The same page renders at different URLs depending on where the site is shown:
 *   - published site → basePath "/acme"      → "/acme" and "/acme/about"
 *   - standalone preview → basePath "/preview" → "/preview" and "/preview/about"
 *
 * The home page (slug "") is the base path itself.
 */
export function hrefFor(page: SitePage, basePath = ""): string {
  const base = basePath.replace(/\/$/, ""); // never leave a trailing slash
  if (page.isHome || !page.slug) return base || "/";
  return `${base}/${page.slug}`;
}

/** The ordered menu links for the header — only pages the user chose to show. */
export function navLinksFor(pages: SitePage[], basePath = ""): NavLink[] {
  return pages
    .filter((page) => page.showInMenu)
    .map((page) => ({
      label: page.label,
      href: hrefFor(page, basePath),
      pageId: page.id,
    }));
}

/** The home page — the one rendered at the base path. */
export function homePage(pages: SitePage[]): SitePage | undefined {
  return pages.find((p) => p.isHome) ?? pages[0];
}

/**
 * Resolve the URL segments after the base path to a page.
 *
 * `/acme`        → segments []          → the home page
 * `/acme/about`  → segments ["about"]   → the page with slug "about"
 * `/acme/nope`   → segments ["nope"]    → undefined (caller shows a 404)
 *
 * Only the FIRST segment is significant — pages are a flat list, not a tree.
 */
export function pageForPath(
  pages: SitePage[],
  segments: string[] | undefined,
): SitePage | undefined {
  const slug = segments?.[0];
  if (!slug) return homePage(pages);
  return pages.find((p) => !p.isHome && p.slug === slug);
}
