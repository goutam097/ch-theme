/**
 * Client-side helper to publish a site snapshot.
 *
 * Posts to our own `/api/sites/<slug>` proxy (which forwards to the backend —
 * the browser can't call the backend directly, no CORS). Throws an `Error`
 * with a friendly message on failure so the Publish button can surface it.
 */

import { toRequestBody, type SiteSnapshot } from "./site-theme";

/**
 * Client-side load of a published theme by slug, via our `/api/sites` proxy.
 * Returns the snapshot, or `null` if no theme is saved for that slug.
 */
export async function fetchSiteTheme(slug: string): Promise<SiteSnapshot | null> {
  const res = await fetch(`/api/sites/${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Could not load the site (${res.status}).`);
  return (await res.json()) as SiteSnapshot;
}

export async function saveSiteTheme(snapshot: SiteSnapshot): Promise<void> {
  const slug = snapshot.settings.slug?.trim();
  if (!slug) throw new Error("Set a site slug in Settings before publishing.");

  let res: Response;
  try {
    res = await fetch(`/api/sites/${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toRequestBody(snapshot)),
    });
  } catch {
    throw new Error("Network error while publishing.");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Publishing failed (${res.status}).`);
  }
}
