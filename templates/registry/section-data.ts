import type {
  AboutData,
  ContactData,
  GalleryItem,
  HeaderData,
  HeroData,
  ServiceItem,
} from "@/types";

export { RENDER_ORDER } from "@/types";

/** Maps each section key to the exact data shape its variant expects. */
export interface SectionContentMap {
  header: HeaderData;
  hero: HeroData;
  about: AboutData;
  services: ServiceItem[];
  gallery: GalleryItem[];
  contact: ContactData;
}
