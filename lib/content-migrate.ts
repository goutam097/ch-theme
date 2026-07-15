/**
 * ============================================================================
 * CONTENT MIGRATION — Upgrade legacy single-page content to the pages model.
 * ============================================================================
 *
 * Before the dynamic-menu feature, a site was ONE page and `SiteContent` was a
 * flat bag of singletons:
 *
 *   { header: { logoText, logoImage, menuItems: string[] },
 *     hero, about, services, gallery, contact }
 *
 * The menu was a list of plain strings with no page behind it, so every menu
 * link 404'd. Now content is `{ header, pages[] }` and each page owns its
 * blocks.
 *
 * Two places still hand us the old shape, and both flow through `migrateContent`:
 *   1. localStorage — a returning user's persisted Redux state.
 *   2. `.data/sites/<slug>.json` — sites published before this change.
 *
 * The migration is LOSSLESS: every legacy section becomes a block on the home
 * page (preserving the old one-page layout), and each legacy menu string becomes
 * a real page carrying a copy of the matching content.
 */

import { DEFAULT_CONTENT } from "@/data/default-content";
import { createBlock, uniqueSlug } from "@/lib/blocks";
import type {
  BlockType,
  PageBlock,
  SiteContent,
  SitePage,
} from "@/types";

/** The old, flat content shape. All fields optional — persisted data may be partial. */
interface LegacyContent {
  header?: { logoText?: string; logoImage?: string; menuItems?: string[] };
  hero?: unknown;
  about?: unknown;
  services?: unknown;
  gallery?: unknown;
  contact?: unknown;
}

/** True when `value` is already in the new shape (has a `pages` array). */
function isCurrentShape(value: unknown): value is SiteContent {
  return (
    !!value &&
    typeof value === "object" &&
    Array.isArray((value as SiteContent).pages)
  );
}

/** True when `value` looks like the pre-pages shape (has any legacy section key). */
function isLegacyShape(value: unknown): value is LegacyContent {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return ["hero", "about", "services", "gallery", "contact"].some(
    (k) => k in v,
  );
}

/** Wrap legacy section data as a block, falling back to the block's defaults. */
function blockFrom(type: BlockType, data: unknown, idSuffix: string): PageBlock {
  const block = createBlock(type);
  block.id = `blk_${type}_${idSuffix}`;

  // Arrays for services/gallery, objects for hero/about/contact. Anything else
  // (null, a string, a stray number) keeps the factory defaults.
  const isArrayBlock = type === "services" || type === "gallery";
  const usable = isArrayBlock
    ? Array.isArray(data) && data.length > 0
    : !!data && typeof data === "object" && !Array.isArray(data);

  if (usable) {
    (block as { data: unknown }).data = data;
  }
  return block;
}

/**
 * Which block a legacy menu label should carry. "About" → an about block, and
 * so on. A label we don't recognise (say the user typed "Pricing") gets a hero
 * block, so the page still renders something.
 */
const LABEL_TO_BLOCK: Record<string, BlockType> = {
  about: "about",
  services: "services",
  service: "services",
  gallery: "gallery",
  portfolio: "gallery",
  contact: "contact",
  "contact us": "contact",
};

/**
 * Convert any stored content — legacy, current, or garbage — into a valid
 * `SiteContent`. Never throws; falls back to the seed content.
 */
export function migrateContent(stored: unknown): SiteContent {
  // Already migrated: just make sure it's structurally sound.
  if (isCurrentShape(stored)) return ensureValid(stored);

  if (!isLegacyShape(stored)) return DEFAULT_CONTENT;

  const legacy = stored as LegacyContent;

  // 1. HOME — every legacy section becomes a block, preserving the old order
  //    and therefore the old one-page layout exactly.
  const home: SitePage = {
    id: "pg_home",
    label: "Home",
    slug: "",
    isHome: true,
    showInMenu: true,
    blocks: [
      blockFrom("hero", legacy.hero, "home"),
      blockFrom("about", legacy.about, "home"),
      blockFrom("services", legacy.services, "home"),
      blockFrom("gallery", legacy.gallery, "home"),
      blockFrom("contact", legacy.contact, "home"),
    ],
  };

  const pages: SitePage[] = [home];

  // 2. Each legacy menu string becomes a real page. "Home" is skipped — it
  //    already exists above and is what the old menu's Home link meant.
  const menuItems = legacy.header?.menuItems ?? [
    "Home",
    "About",
    "Services",
    "Gallery",
    "Contact",
  ];

  for (const raw of menuItems) {
    const label = String(raw ?? "").trim();
    if (!label) continue;
    if (label.toLowerCase() === "home") continue;

    const type = LABEL_TO_BLOCK[label.toLowerCase()] ?? "hero";

    // Give the new page a COPY of the legacy content for its type, so editing
    // the About page later doesn't rewrite the about block on Home.
    const source =
      type === "about"
        ? legacy.about
        : type === "services"
          ? legacy.services
          : type === "gallery"
            ? legacy.gallery
            : type === "contact"
              ? legacy.contact
              : undefined;

    const slug = uniqueSlug(label, pages);
    pages.push({
      id: `pg_${slug}`,
      label,
      slug,
      isHome: false,
      showInMenu: true,
      blocks: [
        blockFrom(type, source ? structuredClone(source) : undefined, slug),
      ],
    });
  }

  return {
    header: {
      logoText: legacy.header?.logoText ?? "MyWebsite",
      logoImage: legacy.header?.logoImage ?? "",
    },
    pages,
  };
}

/**
 * Repair a current-shape payload that's structurally off — no pages at all, or
 * no page flagged as home (which would leave `/` rendering nothing).
 */
function ensureValid(content: SiteContent): SiteContent {
  const pages = content.pages.filter(
    (p) => p && typeof p === "object" && Array.isArray(p.blocks),
  );

  if (pages.length === 0) return DEFAULT_CONTENT;

  // Exactly one home page, and it owns the empty slug.
  if (!pages.some((p) => p.isHome)) {
    pages[0] = { ...pages[0], isHome: true, slug: "" };
  }

  return {
    header: content.header ?? { logoText: "MyWebsite", logoImage: "" },
    pages,
  };
}
