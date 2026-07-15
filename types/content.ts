/**
 * ============================================================================
 * MASTER DATA MODEL — The single source of truth for ALL website content.
 * ============================================================================
 *
 * HOW IT WORKS:
 * - A site is a list of PAGES. Each page owns an ordered list of BLOCKS.
 * - A block is one piece of content (hero, about, services, gallery, contact)
 *   together with its OWN data. Two pages can both hold an `about` block and
 *   each keeps its own text — nothing is shared between them.
 * - The MENU is derived from the pages: every page with `showInMenu` becomes a
 *   nav link. Adding a page therefore adds a menu item, which is what makes the
 *   navigation dynamic.
 * - Every template (Aurora, Meridian, Noir, …) reads from this SAME shape.
 *   A template only decides *which variant renders each block type* — it never
 *   changes the data. That is what makes template switching lossless.
 *
 * EXAMPLE:
 *   pages: [
 *     { slug: "",        label: "Home",    blocks: [hero, about, services, …] },
 *     { slug: "about",   label: "About",   blocks: [about, gallery] },
 *     { slug: "pricing", label: "Pricing", blocks: [hero, services] },  ← user-made
 *   ]
 */

// =============================================================================
// BLOCK DATA INTERFACES — One per kind of content block
// =============================================================================

/**
 * Hero Block Data
 * The banner at the top of a page.
 * Different hero variants use different fields from this interface:
 * - Image hero → uses `image`
 * - Video hero → uses `video`
 * - Carousel hero → uses `carousel[]`
 * - Text-only hero → ignores all media fields
 */
export interface HeroData {
  /** Main headline displayed prominently in the hero */
  title: string;
  /** Small text displayed above or near the title (eyebrow text) */
  subtitle: string;
  /** Longer paragraph text describing the offer/service */
  description: string;
  /** Single background or feature image URL (used by image-based variants) */
  image?: string;
  /** Background or feature video URL (used by video-based variants) */
  video?: string;
  /** Array of image URLs for slider/carousel variants */
  carousel?: string[];
  /** Call-to-action button label, e.g. "Get Started" */
  buttonText?: string;
  /** Where the CTA button links to, e.g. "#contact" */
  buttonLink?: string;
}

/**
 * About Block Data
 * A "who we are" block with a title, description, and optional image.
 */
export interface AboutData {
  /** Block heading, e.g. "About our studio" */
  title: string;
  /** The about story/description paragraph */
  description: string;
  /** Optional image URL (hidden by text-only variants) */
  image?: string;
}

/**
 * A single service item. A `services` block holds an array of these.
 */
export interface ServiceItem {
  /** Service name, e.g. "Brand Strategy" */
  title: string;
  /** Short description of what this service includes */
  description: string;
  /** Optional image/icon URL for the service card */
  image?: string;
}

/**
 * A single gallery item — just an image URL.
 * A `gallery` block holds an array of these.
 */
export interface GalleryItem {
  /** Image URL for this gallery item */
  image: string;
}

/**
 * Contact Block Data
 * Contact information displayed on a page.
 */
export interface ContactData {
  /** Phone number, e.g. "+1 (555) 012-3456" */
  phone: string;
  /** Email address, e.g. "hello@yourstudio.com" */
  email: string;
  /** Physical address */
  address: string;
  /** Google Maps embed URL (used by map-based contact variants) */
  mapUrl?: string;
}

/**
 * API-backed Section Data
 * ------------------------
 * The `event`, `group`, `video`, `podcast`, and `audio` blocks do NOT store
 * their items in the content model — those are fetched LIVE from the backend at
 * render time (see `lib/section-api.ts`). The only thing a block of these types
 * keeps is the `slug` that says whose content to pull. This is why the user
 * never edits the items by hand: the list always reflects the current API
 * response, and switching templates or re-publishing never staled it.
 */
export interface ApiSectionData {
  /** Account/collection slug used to fetch this section's items from the API. */
  slug: string;
}

// =============================================================================
// BLOCKS — A typed union of every content block a page can hold
// =============================================================================

/**
 * Maps each block type to the exact data shape it carries.
 * Adding a new block type = add one entry here + a default in `lib/blocks.ts`
 * + a variant in every template config.
 */
export interface BlockDataMap {
  hero: HeroData;
  about: AboutData;
  services: ServiceItem[];
  gallery: GalleryItem[];
  contact: ContactData;
  // API-backed sections — the block stores only a source `slug`; the items are
  // fetched from the backend when the section renders.
  event: ApiSectionData;
  group: ApiSectionData;
  video: ApiSectionData;
  podcast: ApiSectionData;
  audio: ApiSectionData;
}

/** The kinds of block a user can add to a page. */
export type BlockType = keyof BlockDataMap;

/** Ordered list of block types, used to render the "Add block" picker. */
export const BLOCK_TYPES: BlockType[] = [
  "hero",
  "about",
  "services",
  "gallery",
  "contact",
  "event",
  "group",
  "video",
  "podcast",
  "audio",
];

/** Human labels for the block picker. */
export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Hero",
  about: "About",
  services: "Services",
  gallery: "Gallery",
  contact: "Contact",
  event: "Events",
  group: "Groups",
  video: "My Videos",
  podcast: "Podcast",
  audio: "Audio",
};

/**
 * One content block on a page. This is a DISCRIMINATED UNION: narrowing on
 * `type` narrows `data` to the matching shape, so `block.type === "services"`
 * gives you `ServiceItem[]` with no casting.
 */
export type PageBlock = {
  [T in BlockType]: {
    /** Stable unique id, used as the React key and for update/remove actions */
    id: string;
    /** Which kind of block this is — also selects the template variant */
    type: T;
    /** This block's OWN content (never shared with another block) */
    data: BlockDataMap[T];
  };
}[BlockType];

/** A block of one specific type, e.g. `BlockOf<"hero">`. */
export type BlockOf<T extends BlockType> = Extract<PageBlock, { type: T }>;

// =============================================================================
// PAGES — Each page is a menu item plus its own stack of blocks
// =============================================================================

/**
 * A single page of the website. One page === (at most) one menu item.
 */
export interface SitePage {
  /** Stable unique id — the key used by every page/block action */
  id: string;
  /** Menu label and page title, e.g. "About" */
  label: string;
  /** URL segment, e.g. "about" → /about. The home page uses "" (empty). */
  slug: string;
  /** True for the single home page. It cannot be deleted and its slug is "". */
  isHome: boolean;
  /** Whether this page appears in the site navigation menu */
  showInMenu: boolean;
  /** This page's content, rendered top-to-bottom in this order */
  blocks: PageBlock[];
}

// =============================================================================
// HEADER — Branding only; the menu itself is derived from `pages`
// =============================================================================

/**
 * Header/branding data. NOTE: there is no `menuItems` here any more — the menu
 * is derived from `pages` (see `lib/nav.ts`), so creating a page IS creating a
 * menu item. Keeping a separate list would let the two drift apart.
 */
export interface HeaderData {
  /** Website logo text or branding name */
  logoText?: string;
  /** Logo image URL (alternative to or in addition to logo text) */
  logoImage?: string;
}

/** One resolved navigation link, handed to the header variants at render time. */
export interface NavLink {
  /** Text shown in the menu */
  label: string;
  /** Fully-resolved href, already prefixed for the current base path */
  href: string;
  /** The page this link points at */
  pageId: string;
}

// =============================================================================
// COMBINED SITE CONTENT — The complete content payload for one website
// =============================================================================

/**
 * The complete, template-agnostic content payload for a single website.
 * This is what's stored in Redux (websiteSlice) and passed to TemplateRenderer.
 */
export interface SiteContent {
  /** Branding shown in the header on every page */
  header: HeaderData;
  /** Every page of the site. Exactly one has `isHome: true`. */
  pages: SitePage[];
}

// =============================================================================
// SECTION KEYS — The renderable slots a template must supply a variant for
// =============================================================================

/**
 * A "section" is anything a template provides a variant for: the header (which
 * is chrome, present on every page) plus every block type.
 */
export type SectionKey = "header" | BlockType;
