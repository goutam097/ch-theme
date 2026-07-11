import type { TemplateConfig } from "@/types";

/** Template 3 — "Noir": minimal, typographic, text-first editorial style. */
export const template3: TemplateConfig = {
  id: "template3",
  name: "Noir",
  description: "Minimal editorial design driven by bold typography.",
  category: "Editorial",
  thumbnail:
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
  home: {
    header: "header_v3",
    hero: "hero_v3",
    about: "about_v3",
    services: "services_v3",
    gallery: "gallery_v3",
    contact: "contact_v3",
  },
  theme: {
    primary: "#111111",
    secondary: "#525252",
    accent: "#dc2626",
    background: "#fafaf9",
    foreground: "#111111",
    muted: "#e7e5e4",
    radius: "0rem",
    fontHeading: "Georgia, 'Times New Roman', serif",
    fontBody: "var(--font-geist-sans), system-ui, sans-serif",
  },
};
