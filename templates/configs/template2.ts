import type { TemplateConfig } from "@/types";

/** Template 2 — "Meridian": split-hero corporate / professional services. */
export const template2: TemplateConfig = {
  id: "template2",
  name: "Meridian",
  description: "Trustworthy corporate layout with a split image hero.",
  category: "Corporate",
  thumbnail:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  home: {
    header: "header_v2",
    hero: "hero_v2",
    about: "about_v2",
    services: "services_v2",
    gallery: "gallery_v2",
    contact: "contact_v2",
  },
  theme: {
    primary: "#1d4ed8",
    secondary: "#0f766e",
    accent: "#ea580c",
    background: "#f8fafc",
    foreground: "#0b1220",
    muted: "#e2e8f0",
    radius: "0.375rem",
    fontHeading: "Georgia, 'Times New Roman', serif",
    fontBody: "var(--font-geist-sans), system-ui, sans-serif",
  },
};
