/**
 * ============================================================================
 * ASSET UPLOAD — Swap embedded base64 files for S3 URLs before publishing.
 * ============================================================================
 *
 * Editors store file uploads as base64 data URIs (`data:image/png;base64,…`)
 * inside the content. Publishing that raw would send megabytes of base64 to the
 * backend. Instead, on publish we walk the whole snapshot, upload every base64
 * asset to S3 (via the /api/upload proxy), and replace each data URI with its
 * returned S3 URL. The backend then only ever receives lightweight URLs.
 */

import type { SiteSnapshot } from "./site-theme";

/** True for a base64 data URI like `data:image/png;base64,iVBOR…`. */
function isBase64DataUri(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:") && value.includes(";base64,");
}

/** Recursively collect every unique base64 data URI in a value. */
function collectDataUris(node: unknown, found: Set<string>): void {
  if (isBase64DataUri(node)) {
    found.add(node);
  } else if (Array.isArray(node)) {
    for (const child of node) collectDataUris(child, found);
  } else if (node && typeof node === "object") {
    for (const child of Object.values(node)) collectDataUris(child, found);
  }
}

/** Recursively rebuild a value, replacing data URIs using `map`. */
function replaceDataUris<T>(node: T, map: Map<string, string>): T {
  if (isBase64DataUri(node)) {
    return (map.get(node) ?? node) as T;
  }
  if (Array.isArray(node)) {
    return node.map((child) => replaceDataUris(child, map)) as unknown as T;
  }
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = replaceDataUris(value, map);
    }
    return out as T;
  }
  return node;
}

/** Derive a filename (with extension) from a data URI's mime type. */
function filenameFor(dataUri: string, index: number): string {
  const mime = dataUri.slice(5, dataUri.indexOf(";")); // "image/png"
  const ext = mime.split("/")[1]?.split("+")[0] || "bin";
  return `asset-${index}.${ext}`;
}

/**
 * Upload one base64 data URI to S3 via our `/api/upload` proxy.
 * Sends the `{ data, filename }` payload the backend expects and returns the
 * S3 URL. Throws with a friendly message on failure.
 */
export async function uploadBase64ToS3(dataUri: string, filename: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: dataUri, filename }),
    });
  } catch {
    throw new Error("Network error while uploading images.");
  }

  const body = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok || !body?.url) {
    throw new Error(body?.error ?? `Image upload failed (${res.status}).`);
  }
  return body.url;
}

/**
 * Upload every base64 asset in the snapshot to S3 and return a new snapshot
 * with each data URI replaced by its S3 URL. Identical data URIs are uploaded
 * once. If the snapshot has no base64 assets, the original is returned as-is.
 */
export async function uploadSnapshotAssets(snapshot: SiteSnapshot): Promise<SiteSnapshot> {
  const found = new Set<string>();
  collectDataUris(snapshot, found);
  const uris = [...found];
  if (uris.length === 0) return snapshot;

  const map = new Map<string, string>();
  await Promise.all(
    uris.map(async (uri, i) => {
      const url = await uploadBase64ToS3(uri, filenameFor(uri, i));
      map.set(uri, url);
    }),
  );

  return replaceDataUris(snapshot, map);
}

/** Count of base64 assets in a snapshot (for progress UI). */
export function countBase64Assets(snapshot: SiteSnapshot): number {
  const uris = new Set<string>();
  collectDataUris(snapshot, uris);
  return uris.size;
}
