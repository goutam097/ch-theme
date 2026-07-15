import type { ComponentType } from "react";
import type { SectionVariantId } from "@/types";

import HeroV1 from "../sections/hero/HeroV1";
import HeroV2 from "../sections/hero/HeroV2";
import HeroV3 from "../sections/hero/HeroV3";
import HeroV4 from "../sections/hero/HeroV4";
import HeroV5 from "../sections/hero/HeroV5";

import AboutV1 from "../sections/about/AboutV1";
import AboutV2 from "../sections/about/AboutV2";
import AboutV3 from "../sections/about/AboutV3";
import AboutV4 from "../sections/about/AboutV4";
import AboutV5 from "../sections/about/AboutV5";

import ServicesV1 from "../sections/services/ServicesV1";
import ServicesV2 from "../sections/services/ServicesV2";
import ServicesV3 from "../sections/services/ServicesV3";
import ServicesV4 from "../sections/services/ServicesV4";
import ServicesV5 from "../sections/services/ServicesV5";

import GalleryV1 from "../sections/gallery/GalleryV1";
import GalleryV2 from "../sections/gallery/GalleryV2";
import GalleryV3 from "../sections/gallery/GalleryV3";
import GalleryV4 from "../sections/gallery/GalleryV4";
import GalleryV5 from "../sections/gallery/GalleryV5";

import ContactV1 from "../sections/contact/ContactV1";
import ContactV2 from "../sections/contact/ContactV2";
import ContactV3 from "../sections/contact/ContactV3";
import ContactV4 from "../sections/contact/ContactV4";
import ContactV5 from "../sections/contact/ContactV5";

import HeaderV1 from "../sections/header/HeaderV1";
import HeaderV2 from "../sections/header/HeaderV2";
import HeaderV3 from "../sections/header/HeaderV3";
import HeaderV4 from "../sections/header/HeaderV4";
import HeaderV5 from "../sections/header/HeaderV5";

// API-backed sections (fetch their items at render time from `/api/sections/*`).
import EventV1 from "../sections/events/EventV1";
import GroupV1 from "../sections/groups/GroupV1";
import MyVideoV1 from "../sections/myVideo/MyVideoV1";
import PodcastV1 from "../sections/podcast/PodcastV1";
import AudioV1 from "../sections/audio/AudioV1";

/**
 * SECTION REGISTRY
 * ----------------
 * Maps every `<section>_v<n>` variant id to its React component. The dynamic
 * renderer looks variants up here at runtime, so a template config only needs
 * to store a string. Adding HeroV6 means one import + one line below.
 *
 * Components have section-specific prop types; the value type is intentionally
 * loose (props are supplied by the renderer which knows the correct data shape
 * per section), so we type it as a generic prop-accepting component.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySectionComponent = ComponentType<any>;

export const sectionRegistry: Record<string, AnySectionComponent> = {
  // Hero
  hero_v1: HeroV1,
  hero_v2: HeroV2,
  hero_v3: HeroV3,
  hero_v4: HeroV4,
  hero_v5: HeroV5,
  // About
  about_v1: AboutV1,
  about_v2: AboutV2,
  about_v3: AboutV3,
  about_v4: AboutV4,
  about_v5: AboutV5,
  // Services
  services_v1: ServicesV1,
  services_v2: ServicesV2,
  services_v3: ServicesV3,
  services_v4: ServicesV4,
  services_v5: ServicesV5,
  // Gallery
  gallery_v1: GalleryV1,
  gallery_v2: GalleryV2,
  gallery_v3: GalleryV3,
  gallery_v4: GalleryV4,
  gallery_v5: GalleryV5,
  // Contact
  contact_v1: ContactV1,
  contact_v2: ContactV2,
  contact_v3: ContactV3,
  contact_v4: ContactV4,
  contact_v5: ContactV5,
  // Header
  header_v1: HeaderV1,
  header_v2: HeaderV2,
  header_v3: HeaderV3,
  header_v4: HeaderV4,
  header_v5: HeaderV5,
  // API-backed sections
  event_v1: EventV1,
  group_v1: GroupV1,
  video_v1: MyVideoV1,
  podcast_v1: PodcastV1,
  audio_v1: AudioV1,
};

export function getSectionComponent(
  id: SectionVariantId,
): AnySectionComponent | undefined {
  return sectionRegistry[id];
}
