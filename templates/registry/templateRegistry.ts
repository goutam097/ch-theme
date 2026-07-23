import type { TemplateConfig } from "@/types";
import {
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
} from "../configs";

/**
 * TEMPLATE REGISTRY
 * -----------------
 * The single source of truth for available templates. To add Template 6…20,
 * create `configs/template6.ts` and add one line here — no new pages, no new
 * routes. The dashboard, template gallery, and renderer all read from this map.
 */
export const templates: Record<string, TemplateConfig> = {
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
};

/** Stable, ordered list for galleries and selectors. */
export const templateList: TemplateConfig[] = Object.values(templates);

export function getTemplate(id: string): TemplateConfig {
  return templates[id] ?? template1;
}

export function isValidTemplate(id: string): boolean {
  return id in templates;
}
