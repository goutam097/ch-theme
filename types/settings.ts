/**
 * ============================================================================
 * SETTINGS & MEDIA TYPES — Site-wide configuration and media library
 * ============================================================================
 */

// =============================================================================
// SITE SETTINGS — Applied globally, independent of the chosen template
// =============================================================================

/** Site-wide settings that apply regardless of which template is active. */
export interface SiteSettings {
  /** Display name of the site, e.g. "Your Studio" */
  siteName: string;
  /** URL slug for the published site: /<slug> */
  slug: string;
  /** Optional favicon URL */
  favicon?: string;
  /** SEO title tag for search engines */
  seoTitle: string;
  /** SEO meta description for search result snippets */
  seoDescription: string;
  /** Social share image (og:image) URL */
  socialImage?: string;
  /** Publication state: "draft" (not live) or "published" (live at /<slug>) */
  status: "draft" | "published";
  /** ISO timestamp of last publish; null when the site has never been published */
  publishedAt: string | null;
}

// =============================================================================
// MEDIA LIBRARY — Tracks uploaded/referenced media assets
// =============================================================================

/** A single uploaded/added media asset tracked by the media library. */
export interface MediaAsset {
  /** Unique identifier for this asset */
  id: string;
  /** The URL where this asset can be loaded from */
  url: string;
  /** Human-readable filename */
  name: string;
  /** Whether this is an image or video file */
  type: "image" | "video";
}

// =============================================================================
// PREVIEW — Responsive preview viewport modes
// =============================================================================

/**
 * Preview viewport modes for the responsive live preview.
 * Controls the width of the preview canvas:
 *   - "desktop" → full width
 *   - "tablet"  → 768px
 *   - "mobile"  → 390px
 */
export type PreviewDevice = "desktop" | "tablet" | "mobile";
