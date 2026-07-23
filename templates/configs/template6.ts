import type { TemplateConfig } from "@/types";

/** Template 6 — "Atelier": warm boutique/luxury look with framed imagery. */
export const template6: TemplateConfig = {
  id: "template6",
  name: "Atelier",
  description: "Elegant boutique design with ivory tones and gold keylines.",
  category: "Boutique",
  thumbnail:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  home: {
    header: "header_v6",
    hero: "hero_v6",
    about: "about_v6",
    services: "services_v6",
    gallery: "gallery_v6",
    contact: "contact_v6",
    event: "event_v1",
    group: "group_v1",
    video: "video_v1",
    podcast: "podcast_v1",
    audio: "audio_v1",
  },
  theme: {
    primary: "#1f3a2e",
    secondary: "#7c7365",
    accent: "#b08d57",
    background: "#faf7f0",
    foreground: "#241f1a",
    muted: "#efe8db",
    radius: "0.125rem",
    fontHeading: "Georgia, 'Times New Roman', serif",
    fontBody: "var(--font-geist-sans), system-ui, sans-serif",
  },
};
