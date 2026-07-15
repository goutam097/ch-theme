/**
 * ============================================================================
 * TEMPLATE TYPES — How templates define their visual identity
 * ============================================================================
 *
 * HOW TEMPLATES WORK:
 * A "template" in this system is NOT a page or folder of components.
 * It's a simple CONFIG OBJECT that says:
 *   "For my hero section, use variant hero_v1"
 *   "For my about section, use variant about_v3"
 *   "Use this color palette and these fonts"
 *
 * That's it. No duplicated page files, no duplicated components.
 * Adding a new template = adding one config object.
 *
 * The TemplateRenderer reads this config and dynamically assembles
 * the page from the section registry.
 */

import type { SectionKey } from "./content";

// =============================================================================
// VARIANT ID TYPES — String identifiers like "hero_v1", "about_v3", etc.
// =============================================================================

/**
 * Variant identifiers follow the convention `<section>_v<n>`, e.g. `hero_v1`.
 * These string keys are the only thing a template config stores — the actual
 * React component is resolved lazily through the section registry at runtime.
 */
export type HeaderVariant = `header_v${number}`;
export type HeroVariant = `hero_v${number}`;
export type AboutVariant = `about_v${number}`;
export type ServicesVariant = `services_v${number}`;
export type GalleryVariant = `gallery_v${number}`;
export type ContactVariant = `contact_v${number}`;
export type EventVariant = `event_v${number}`;
export type GroupVariant = `group_v${number}`;
export type VideoVariant = `video_v${number}`;
export type PodcastVariant = `podcast_v${number}`;
export type AudioVariant = `audio_v${number}`;

/** Union of ALL possible section variant IDs across all section types */
export type SectionVariantId =
  | HeaderVariant
  | HeroVariant
  | AboutVariant
  | ServicesVariant
  | GalleryVariant
  | ContactVariant
  | EventVariant
  | GroupVariant
  | VideoVariant
  | PodcastVariant
  | AudioVariant;

// =============================================================================
// SECTION VARIANT MAP — Which variant each section uses in a template
// =============================================================================

/**
 * Maps each section to the variant a template uses.
 * This IS the entire visual identity of a template expressed as data.
 *
 * A block of type `about` on ANY page renders with the template's `about`
 * variant — so a template needs one variant per block type, not per page.
 *
 * EXAMPLE:
 *   Template "Aurora" → { header: "header_v1", hero: "hero_v1", about: "about_v1", ... }
 *   Template "Pulse"  → { header: "header_v4", hero: "hero_v4", about: "about_v4", ... }
 */
export interface SectionVariantMap {
  header: HeaderVariant;
  hero: HeroVariant;
  about: AboutVariant;
  services: ServicesVariant;
  gallery: GalleryVariant;
  contact: ContactVariant;
  event: EventVariant;
  group: GroupVariant;
  video: VideoVariant;
  podcast: PodcastVariant;
  audio: AudioVariant;
}

// =============================================================================
// TEMPLATE THEME — Design tokens (colors, fonts, radius) for a template
// =============================================================================

/**
 * A design token preset bundled with each template.
 * These values are projected onto CSS custom properties (--site-primary, etc.)
 * by the ThemeScope component, so section variants can read them via
 * Tailwind arbitrary values like `bg-[var(--site-primary)]`.
 *
 * This means the SAME component renders with completely different colors/fonts
 * depending on which template is active — no recompilation needed.
 */
export interface TemplateTheme {
  /** Primary brand color, e.g. "#6366f1" (indigo) */
  primary: string;
  /** Secondary color for accents/backgrounds */
  secondary: string;
  /** Accent color for highlights, CTAs */
  accent: string;
  /** Page background color, e.g. "#ffffff" */
  background: string;
  /** Main text color, e.g. "#0f172a" */
  foreground: string;
  /** Muted/subtle background color for cards, badges */
  muted: string;
  /** Heading font family CSS value */
  fontHeading: string;
  /** Body text font family CSS value */
  fontBody: string;
  /** Global corner rounding token, e.g. "0.5rem", "0rem" for sharp corners */
  radius: string;
}

// =============================================================================
// TEMPLATE CONFIG — The complete definition of a template
// =============================================================================

/**
 * A TemplateConfig is purely declarative: which variant renders each section,
 * plus a theme preset and presentation metadata.
 *
 * ADDING A NEW TEMPLATE:
 * 1. Create a new file in `templates/configs/` (e.g. template6.ts)
 * 2. Export an object matching this interface
 * 3. Add it to `templates/configs/index.ts`
 * 4. Add it to `templates/registry/templateRegistry.ts`
 * That's it — NO new pages, NO new routes, NO new components needed.
 */
export interface TemplateConfig {
  /** Unique identifier, e.g. "template1" */
  id: string;
  /** Display name shown in the gallery, e.g. "Aurora" */
  name: string;
  /** Short description for the template card */
  description: string;
  /** Category label, e.g. "SaaS", "Corporate", "Creative" */
  category: string;
  /** Thumbnail image URL for the template gallery picker */
  thumbnail: string;
  /**
   * Block type → variant mapping. Applies to blocks on EVERY page, not just
   * home. (The field is named `home` for backwards compatibility with the
   * existing template configs.)
   */
  home: SectionVariantMap;
  /** Design tokens (colors, fonts, border radius) */
  theme: TemplateTheme;
}

/** Template IDs are just strings */
export type TemplateId = string;
