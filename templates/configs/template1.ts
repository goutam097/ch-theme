import type { TemplateConfig } from "@/types";

/**
 * Template 1 — "Aurora": a clean, modern SaaS look with an image hero.
 * A template config is pure data: it only declares which variant renders each
 * section plus a theme preset. No page components are duplicated.
 */
export const template1: TemplateConfig = {
  id: "template1",
  name: "Aurora",
  description: "Clean, modern SaaS landing with a bright image hero.",
  category: "SaaS",
  thumbnail:
    "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=600&q=80",
  home: {
    header: "header_v1",
    hero: "hero_v1",
    about: "about_v1",
    services: "services_v1",
    gallery: "gallery_v1",
    contact: "contact_v1",
    event: "event_v1",
    group: "group_v1",
    video: "video_v1",
    podcast: "podcast_v1",
    audio: "audio_v1",
  },
  theme: {
    primary: "#6366f1",
    secondary: "#0ea5e9",
    accent: "#f59e0b",
    background: "#ffffff",
    foreground: "#0f172a",
    muted: "#f1f5f9",
    radius: "0.75rem",
    fontHeading: "var(--font-geist-sans), system-ui, sans-serif",
    fontBody: "var(--font-geist-sans), system-ui, sans-serif",
  },
};
