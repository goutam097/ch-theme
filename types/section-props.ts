/**
 * ============================================================================
 * SECTION COMPONENT PROPS — What every section variant receives as props
 * ============================================================================
 *
 * Every section variant (HeroV1, HeroV2, AboutV1, etc.) receives:
 *   1. `data` — the content for that section (from the master data model)
 *   2. `theme` — the active template's design tokens (colors, fonts, etc.)
 *
 * Variants are PURE, PRESENTATIONAL, and STATELESS:
 * - They just render what they're given
 * - They work identically in the live preview, standalone preview, and published site
 * - They never modify the data or call Redux
 */

import type {
  AboutData,
  ApiSectionData,
  ContactData,
  GalleryItem,
  HeaderData,
  HeroData,
  ServiceItem,
} from "./content";
import type { TemplateTheme } from "./template";

/**
 * Generic props interface for all section components.
 * `TData` is the specific data type for each section:
 *   - Hero sections get `HeroData`
 *   - About sections get `AboutData`
 *   - Services sections get `ServiceItem[]`
 *   - etc.
 */
export interface SectionComponentProps<TData> {
  /** The content data for this section (slice of the master model) */
  data: TData;
  /** The active template's design tokens (colors, fonts, border radius) */
  theme: TemplateTheme;
}

// =============================================================================
// CONCRETE SECTION PROP TYPES — One per section type
// =============================================================================

/** Props for Header section variants (HeaderV1, HeaderV2, ...) */
export type HeaderSectionProps = SectionComponentProps<HeaderData>;

/** Props for Hero section variants (HeroV1, HeroV2, ...) */
export type HeroSectionProps = SectionComponentProps<HeroData>;

/** Props for About section variants (AboutV1, AboutV2, ...) */
export type AboutSectionProps = SectionComponentProps<AboutData>;

/** Props for Services section variants — receives an ARRAY of services */
export type ServicesSectionProps = SectionComponentProps<ServiceItem[]>;

/** Props for Gallery section variants — receives an ARRAY of gallery items */
export type GallerySectionProps = SectionComponentProps<GalleryItem[]>;

/** Props for Contact section variants */
export type ContactSectionProps = SectionComponentProps<ContactData>;

/**
 * Props for the API-backed section variants (Events, Groups, My Videos,
 * Podcast, Audio). They receive only the source config (`slug`) and fetch their
 * own items at render time — the `data` is never the item list itself.
 */
export type ApiSectionProps = SectionComponentProps<ApiSectionData>;
export type EventSectionProps = ApiSectionProps;
export type GroupSectionProps = ApiSectionProps;
export type VideoSectionProps = ApiSectionProps;
export type PodcastSectionProps = ApiSectionProps;
export type AudioSectionProps = ApiSectionProps;

/**
 * Union of all possible section props.
 * Used by the TemplateRenderer to pass the correct data to any section variant.
 */
export type AnySectionProps =
  | HeroSectionProps
  | AboutSectionProps
  | ServicesSectionProps
  | GallerySectionProps
  | ContactSectionProps
  | ApiSectionProps;
