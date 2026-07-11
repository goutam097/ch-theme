/**
 * ============================================================================
 * GALLERY PROXY — Server-side proxy for the external album photos API.
 * ============================================================================
 *
 * WHY THIS EXISTS:
 * The upstream album API (shanviatechdev.com) does not send CORS headers, so
 * the browser cannot call it directly from the dashboard. This Route Handler
 * runs on the server, fetches the album, and re-shapes the response into the
 * app's `GalleryItem[]` model — the same shape the GalleryEditor writes to the
 * store and every Gallery variant renders.
 *
 * USAGE:  GET /api/gallery?slug=test999&page=1
 */

import type { GalleryItem } from "@/types";

/** Base URL of the upstream album service (all-photos endpoint). */
const UPSTREAM = "https://shanviatechdev.com/api/v1/album/all-photos";

/** Shape of a single photo in the upstream response (only fields we use). */
interface UpstreamPhoto {
  id: string;
  post_url: string;
}

/** Shape of the upstream `all-photos` payload (only fields we use). */
interface UpstreamResponse {
  code: number;
  message: string;
  data?: {
    authorName?: string;
    photos?: UpstreamPhoto[];
  };
}

/** Successful shape returned to our own client. */
interface GalleryApiResult {
  items: GalleryItem[];
  authorName: string;
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  const page = searchParams.get("page")?.trim() || "1";

  if (!slug) {
    return Response.json({ error: "A gallery slug is required." }, { status: 400 });
  }

  const url = `${UPSTREAM}/${encodeURIComponent(slug)}/${encodeURIComponent(page)}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      headers: { Accept: "application/json" },
      // The album can change, so never serve a stale cached copy.
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { error: "Could not reach the gallery service. Please try again." },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    return Response.json(
      { error: `Gallery service returned ${upstream.status}.` },
      { status: 502 },
    );
  }

  let payload: UpstreamResponse;
  try {
    payload = (await upstream.json()) as UpstreamResponse;
  } catch {
    return Response.json({ error: "Gallery service sent an invalid response." }, { status: 502 });
  }

  // Map upstream photos → the app's GalleryItem[] model, dropping any without a URL.
  const items: GalleryItem[] = (payload.data?.photos ?? [])
    .map((photo) => ({ image: photo.post_url }))
    .filter((item) => typeof item.image === "string" && item.image.length > 0);

  const result: GalleryApiResult = {
    items,
    authorName: payload.data?.authorName ?? "",
  };

  return Response.json(result);
}
