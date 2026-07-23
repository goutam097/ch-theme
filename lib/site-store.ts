/**
 * ============================================================================
 * SERVER-SIDE SNAPSHOT STORE — Read-back store for published sites.
 * ============================================================================
 *
 * The upstream backend (`THEME_API_BASE`) is WRITE-ONLY: `POST .../theme/<slug>`
 * saves a snapshot and returns 201, but it exposes no matching read route —
 * every GET (any path, even "/") returns its `{statusCode:200,message:"Blank
 * URL"}` catch-all. So after publishing, `/<slug>` could never fetch the
 * snapshot back and rendered "Site not found".
 *
 * To make publish → view work, the `/api/sites/<slug>` proxy persists each
 * published snapshot here (a JSON file per slug) and serves reads from it,
 * independent of the upstream backend. Writes are still forwarded upstream so
 * the backend keeps its copy.
 *
 * This runs only on the server (Node runtime) — never import it into a Client
 * Component.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SiteSnapshot } from "./site-theme";

/** Directory (gitignored) where per-slug snapshot files live. */
const STORE_DIR = path.join(process.cwd(), ".data", "sites");

/**
 * Turn a slug into a safe, flat filename. Strips anything that isn't a URL-slug
 * character so a crafted slug can't escape `STORE_DIR` (path traversal).
 */
function fileFor(slug: string): string {
  const safe = slug.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
  return path.join(STORE_DIR, `${safe}.json`);
}

/** Persist a published snapshot for `slug`, overwriting any previous copy. */
export async function saveSnapshot(slug: string, snapshot: SiteSnapshot): Promise<void> {
  await mkdir(STORE_DIR, { recursive: true });
  await writeFile(fileFor(slug), JSON.stringify(snapshot), "utf8");
}

/** Read the snapshot saved for `slug`, or `null` if none has been published. */
export async function readSnapshot(slug: string): Promise<SiteSnapshot | null> {
  try {
    return JSON.parse(await readFile(fileFor(slug), "utf8")) as SiteSnapshot;
  } catch {
    return null; // ENOENT (never published) or unreadable/corrupt file.
  }
}
