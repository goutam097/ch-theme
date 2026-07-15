import { Fragment } from "react";
import { ThemeScope } from "../theme/ThemeScope";
import { SiteNavProvider } from "../nav/SiteNavContext";
import { getSectionComponent } from "./sectionRegistry";
import { getTemplate } from "./templateRegistry";
import { hrefFor, homePage, navLinksFor, pageForPath } from "@/lib/nav";
import type { SiteContent, SitePage } from "@/types";

interface TemplateRendererProps {
  /** Which template's variants + theme to render with, e.g. "template1". */
  templateId: string;
  /** The whole site (all pages) — the renderer picks the one to show. */
  content: SiteContent;
  /**
   * URL segments after the base path that select the page.
   * `[]`/undefined → home, `["about"]` → the page with slug "about".
   * Ignored when `pageId` is given.
   */
  segments?: string[];
  /** Show this exact page, by id. Used by the dashboard preview. */
  pageId?: string;
  /** Prefix for every menu href, e.g. "/site/acme". "" on a root-mounted site. */
  basePath?: string;
  /**
   * When provided, menu clicks call this instead of navigating — the dashboard
   * preview uses it to swap the previewed page in place.
   */
  onNavigate?: (pageId: string) => void;
}

/**
 * DYNAMIC RENDERING ENGINE
 * ------------------------
 * Given a template and the site content, this:
 *   1. resolves the template config (which variant per block type),
 *   2. picks the page to show (from `pageId`, else from the URL segments),
 *   3. renders the header, then that page's blocks top-to-bottom,
 *   4. feeds each block's OWN data to the variant the template chose for its type,
 *   5. wraps it all in <ThemeScope> (theme tokens) and <SiteNavProvider> (menu).
 *
 * The same function powers the live preview, the standalone preview route, and
 * the published public site — so output is pixel-identical everywhere.
 */
export function TemplateRenderer({
  templateId,
  content,
  segments,
  pageId,
  basePath = "",
  onNavigate,
}: TemplateRendererProps) {
  const template = getTemplate(templateId);
  const pages = content.pages ?? [];

  const page: SitePage | undefined = pageId
    ? pages.find((p) => p.id === pageId)
    : pageForPath(pages, segments);

  const home = homePage(pages);

  const nav = {
    links: navLinksFor(pages, basePath),
    homeLink: home
      ? { label: home.label, href: hrefFor(home, basePath), pageId: home.id }
      : null,
    activePageId: page?.id ?? null,
    mode: onNavigate ? ("preview" as const) : ("route" as const),
    onNavigate,
  };

  /**
   * Everything to render, top to bottom: the header (chrome — it appears on
   * every page) followed by the page's own blocks. Each slot names the variant
   * that draws it and the data to draw. A block's TYPE picks the variant; its
   * DATA is its own.
   */
  const slots = [
    {
      key: "header",
      variantId: template.home.header,
      data: content.header as unknown,
    },
    ...(page?.blocks ?? []).map((block) => ({
      key: block.id,
      variantId: template.home[block.type],
      data: block.data as unknown,
    })),
  ];

  return (
    <ThemeScope theme={template.theme}>
      <SiteNavProvider value={nav}>
        {slots.map((slot) => {
          const Section = getSectionComponent(slot.variantId);

          if (!Section) {
            if (process.env.NODE_ENV !== "production") {
              console.warn(`[TemplateRenderer] Missing variant "${slot.variantId}"`);
            }
            return null;
          }

          return (
            <Fragment key={slot.key}>
              <Section data={slot.data} theme={template.theme} />
            </Fragment>
          );
        })}

        {/* Unknown URL: keep the header/menu so the visitor can navigate out. */}
        {!page && <PageNotFound />}
      </SiteNavProvider>
    </ThemeScope>
  );
}

/** Shown when a URL doesn't match any page (e.g. a deleted page still linked). */
function PageNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-12 text-center">
      <p className="text-3xl font-bold text-[var(--site-foreground)]">
        Page not found
      </p>
      <p className="text-sm opacity-60">
        This page doesn&apos;t exist on this site.
      </p>
    </div>
  );
}
