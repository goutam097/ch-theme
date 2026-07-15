import type { TemplateConfig } from "@/types";

/** Template 5 — "Bloom": colorful creative agency with a carousel hero. */
export const template5: TemplateConfig = {
  id: "template5",
  name: "Bloom",
  description: "Vibrant creative agency look with a rotating image carousel.",
  category: "Agency",
  thumbnail:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  home: {
    header: "header_v5",
    hero: "hero_v5",
    about: "about_v5",
    services: "services_v5",
    gallery: "gallery_v5",
    contact: "contact_v5",
    event: "event_v1",
    group: "group_v1",
    video: "video_v1",
    podcast: "podcast_v1",
    audio: "audio_v1",
  },
  theme: {
    primary: "#db2777",
    secondary: "#0d9488",
    accent: "#7c3aed",
    background: "#fff7fb",
    foreground: "#1f1147",
    muted: "#fce7f3",
    radius: "1.5rem",
    fontHeading: "var(--font-geist-sans), system-ui, sans-serif",
    fontBody: "var(--font-geist-sans), system-ui, sans-serif",
  },
};
