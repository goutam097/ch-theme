/**
 * Client helper for loading gallery images from the external album API.
 *
 * It calls our own `/api/gallery` proxy (never the upstream service directly,
 * which has no CORS headers) and returns `GalleryItem[]` — the exact shape the
 * store holds and every Gallery variant renders. The GalleryEditor uses this to
 * populate the gallery when the user chooses the "From API" source.
 */

import type { GalleryItem } from "@/types";

/** Shape returned by our `/api/gallery` proxy route on success. */
interface GalleryApiResult {
  items: GalleryItem[];
  authorName: string;
}

/**
 * Fetch gallery images for an album `slug` (and optional `page`) via the proxy.
 * Throws an `Error` with a user-friendly message on any failure.
 */
export async function fetchGalleryFromApi(slug: string, page = 1): Promise<GalleryApiResult> {
  const trimmed = slug.trim();
  if (!trimmed) throw new Error("Enter a gallery slug first.");

  const params = new URLSearchParams({ slug: trimmed, page: String(page) });

  let res: Response;
  try {
    res = await fetch(`/api/gallery?${params.toString()}`);
  } catch {
    throw new Error("Network error while loading the gallery.");
  }

  const body = (await res.json().catch(() => null)) as
    | (GalleryApiResult & { error?: string })
    | null;

  if (!res.ok || !body) {
    throw new Error(body?.error ?? "Could not load the gallery.");
  }

  if (!body.items.length) {
    throw new Error("No photos were found for that slug.");
  }

  return body;
}
