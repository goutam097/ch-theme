"use client";

import { useAppSelector } from "@/store/hooks";
import { getTemplate } from "@/templates/registry/templateRegistry";
import type { SiteSnapshot } from "@/lib/site-theme";

/** The full content payload (master data model) from the store. */
export function useSiteContent() {
  return useAppSelector((s) => s.website);
}

/** The active template's resolved config (variant map + theme + metadata). */
export function useActiveTemplate() {
  const id = useAppSelector((s) => s.template.activeTemplateId);
  return getTemplate(id);
}

/** Site-wide settings (name, slug, SEO, publish state, preview device). */
export function useSettings() {
  return useAppSelector((s) => s.settings);
}

/**
 * Assembles the full publishable snapshot ({templateId, content, settings})
 * from the store. The transient `previewDevice` is stripped — it's UI-only
 * state that never belongs in a saved/published site.
 */
export function useSiteSnapshot(): SiteSnapshot {
  const content = useAppSelector((s) => s.website);
  const templateId = useAppSelector((s) => s.template.activeTemplateId);
  const settings = { ...useAppSelector((s) => s.settings) };
  delete (settings as { previewDevice?: unknown }).previewDevice;
  return { templateId, content, settings };
}
