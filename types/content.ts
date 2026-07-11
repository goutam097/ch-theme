/**
 * ============================================================================
 * MASTER DATA MODEL — The single source of truth for ALL website content.
 * ============================================================================
 *
 * HOW IT WORKS:
 * - Every template (Aurora, Meridian, Noir, etc.) reads from the SAME data shape.
 * - A variant only decides *which fields it renders* — it never changes the data structure.
 * - This is what makes template switching "lossless": switching from Template 1
 *   to Template 5 keeps all content intact because both read the same `SiteContent`.
 *
 * EXAMPLE:
 * - HeroV1 (image hero) renders: title, subtitle, description, image, button
 * - HeroV3 (text-only hero) renders: title, subtitle, description (ignores image/video)
 * - HeroV5 (carousel hero) renders: title, description, carousel[] images
 * - But ALL of them receive the SAME `HeroData` object.
 */

// =============================================================================
// SECTION DATA INTERFACES — One per website section
// =============================================================================

/**
 * Hero Section Data
 * The hero is the first thing visitors see on the page.
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
 * About Section Data
 * A simple "who we are" section with a title, description, and optional image.
 */
export interface AboutData {
  /** Section heading, e.g. "About our studio" */
  title: string;
  /** The about story/description paragraph */
  description: string;
  /** Optional image URL (hidden by text-only variants) */
  image?: string;
}

/**
 * A single service item (the Services section contains an array of these).
 * Each service has a title, description, and optional image.
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
 * The Gallery section contains an array of these.
 */
export interface GalleryItem {
  /** Image URL for this gallery item */
  image: string;
}

/**
 * Contact Section Data
 * Contact information displayed on the website.
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
 * Header Section Data
 * Navigation and branding information for the header.
 */
export interface HeaderData {
  /** Website logo text or branding name */
  logoText?: string;
  /** Logo image URL (alternative to or in addition to logo text) */
  logoImage?: string;
  /** Navigation menu items */
  menuItems?: string[];
}

// =============================================================================
// COMBINED SITE CONTENT — The complete content payload for one website
// =============================================================================

/**
 * The complete, template-agnostic content payload for a single website.
 * This is what's stored in Redux (websiteSlice) and passed to TemplateRenderer.
 *
 * NOTE: `services` and `gallery` are arrays (user can add/remove items),
 * while `hero`, `about`, `contact`, and `header` are single objects.
 */
export interface SiteContent {
  header: HeaderData;
  hero: HeroData;
  about: AboutData;
  services: ServiceItem[];
  gallery: GalleryItem[];
  contact: ContactData;
}

/**
 * The six logical sections every template renders on its Home page.
 * This type is derived from SiteContent keys, so it stays in sync automatically.
 */
export type SectionKey = keyof SiteContent;

/**
 * Ordered list of all section keys.
 * Used by editors and navigation to enumerate sections.
 */
export const SECTION_KEYS: SectionKey[] = [
  "header",
  "hero",
  "about",
  "services",
  "gallery",
  "contact",
];
