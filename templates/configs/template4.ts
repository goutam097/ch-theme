import type { TemplateConfig } from "@/types";

/** Template 4 — "Pulse": dark, cinematic, video-led hero. */
export const template4: TemplateConfig = {
  id: "template4",
  name: "Pulse",
  description: "Dark, cinematic landing with a full-bleed video hero.",
  category: "Creative",
  thumbnail:
    "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=600&q=80",
  home: {
    header: "header_v4",
    hero: "hero_v4",
    about: "about_v4",
    services: "services_v4",
    gallery: "gallery_v4",
    contact: "contact_v4",
  },
  theme: {
    primary: "#f59e0b",
    secondary: "#ef4444",
    accent: "#22d3ee",
    background: "#0a0a0a",
    foreground: "#fafafa",
    muted: "#1c1c1c",
    radius: "1rem",
    fontHeading: "var(--font-geist-sans), system-ui, sans-serif",
    fontBody: "var(--font-geist-sans), system-ui, sans-serif",
  },
};
