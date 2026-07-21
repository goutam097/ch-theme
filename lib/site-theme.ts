/**
 * ============================================================================
 * SITE THEME SNAPSHOT — Save the whole site to the backend & load it by slug.
 * ============================================================================
 *
 * A "snapshot" is the complete, template-agnostic description of one published
 * site: which template is active, all its content, and its settings. This is
 * the JSON that gets POSTed to the backend on Publish and fetched back (by
 * slug) to render the public site at /<slug>.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS THE SINGLE SOURCE OF TRUTH FOR THE BACKEND CONTRACT.
 * If the backend body/response shape differs from what's assumed here, adjust
 * `THEME_API_BASE`, `toRequestBody`, and `extractSnapshot` — nothing else.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { SiteContent, SiteSettings } from "@/types";

/** Everything needed to reproduce one published site. */
export interface SiteSnapshot {
  /** Active template id, e.g. "template1". */
  templateId: string;
  /** All section content (hero, about, services, gallery, contact, header). */
  content: SiteContent;
  /** Site-wide settings (name, slug, SEO, publish status). */
  settings: SiteSettings;
}

/**
 * Backend endpoint base. The slug is appended: `${THEME_API_BASE}/<slug>`.
 *   - POST `${THEME_API_BASE}/<slug>`  → save the snapshot JSON
 *   - GET  `${THEME_API_BASE}/<slug>`  → load the saved snapshot
 */
export const THEME_API_BASE = "http://localhost:5000/v1/site/theme";

/**
 * Shape the request body sent to the backend on save.
 * Currently the snapshot is sent as-is; wrap it here if the API expects an
 * envelope (e.g. `{ theme: snapshot }` or `{ data: snapshot }`).
 */
export function toRequestBody(snapshot: SiteSnapshot): unknown {
  return snapshot;
}

/**
 * Pull a `SiteSnapshot` out of whatever envelope the backend returns.
 * Handles both a raw snapshot and a `{ data: snapshot }` / `{ theme: snapshot }`
 * wrapper. Returns `null` when the payload holds no usable snapshot (e.g. the
 * "Blank URL" placeholder the backend returns for an un-saved slug).
 */
export function extractSnapshot(payload: unknown): SiteSnapshot | null {
  if (!payload || typeof payload !== "object") return null;
  const env = payload as Record<string, unknown>;

  // Unwrap common envelope keys, else treat the payload itself as the snapshot.
  const candidate = (env.data ?? env.theme ?? env) as Record<string, unknown>;

  const looksValid =
    candidate &&
    typeof candidate.templateId === "string" &&
    typeof candidate.content === "object" &&
    candidate.content !== null &&
    typeof candidate.settings === "object" &&
    candidate.settings !== null;

  return looksValid ? (candidate as unknown as SiteSnapshot) : null;
}

/**
 * Server-side: fetch and parse a published theme by slug.
 * Returns `null` if the slug has no saved theme or the backend is unreachable.
 * Called from the public `/<slug>` Server Component (no CORS server-side).
 */
export async function loadSiteTheme(slug: string): Promise<SiteSnapshot | null> {
  try {
    const res = await fetch(`${THEME_API_BASE}/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store", // published content can change; always read fresh
    });
    if (!res.ok) return null;
    return extractSnapshot(await res.json());
  } catch {
    return null;
  }
}
