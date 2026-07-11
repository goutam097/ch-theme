/**
 * ============================================================================
 * SITE THEME PROXY — Save/load a site snapshot for the browser.
 * ============================================================================
 *
 * The dashboard (Publish button) runs in the browser and cannot POST directly
 * to the backend (no CORS headers). These Route Handlers run on the server and
 * handle both sides of publishing:
 *
 *   POST /api/sites/<slug>  → persist the snapshot locally + forward to backend
 *   GET  /api/sites/<slug>  → load the saved snapshot (unwrapped)
 *
 * WHY WE PERSIST LOCALLY: the upstream backend is write-only — it accepts the
 * POST (201 "Template Json Submit Successfully") but has no read route, so a
 * GET always returns its "Blank URL" catch-all. Without a local copy the public
 * `/site/<slug>` page could never read the snapshot back. So POST saves to a
 * server-side store (`lib/site-store`) that GET reads from; the forward upstream
 * is kept best-effort so the backend still gets its copy.
 */

import { THEME_API_BASE } from "@/lib/site-theme";
import { extractSnapshot } from "@/lib/site-theme";
import { readSnapshot, saveSnapshot } from "@/lib/site-store";

type Ctx = { params: Promise<{ slug: string }> };

/**
 * Save the snapshot: persist locally (authoritative for reads), then forward to
 * the backend best-effort. Publishing succeeds as long as the local save works,
 * so a flaky/down backend doesn't block going live.
 */
export async function POST(request: Request, ctx: Ctx): Promise<Response> {
  const { slug } = await ctx.params;
  const body = await request.text();

  // 1. Persist locally so `/site/<slug>` can read the snapshot back. The client
  //    sends the raw SiteSnapshot JSON; parse it and store it authoritatively.
  const snapshot = extractSnapshot(safeJson(body));
  if (!snapshot) {
    return Response.json({ error: "Publish payload was not a valid site snapshot." }, { status: 400 });
  }
  try {
    await saveSnapshot(slug, snapshot);
  } catch {
    return Response.json({ error: "Could not save the site. Please try again." }, { status: 500 });
  }

  // 2. Forward to the backend best-effort — keep its copy in sync, but don't let
  //    a backend failure fail the publish now that reads come from local store.
  try {
    await fetch(`${THEME_API_BASE}/${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body,
      cache: "no-store",
    });
  } catch {
    /* backend unreachable — local copy already saved, so publish still stands */
  }

  return Response.json({ ok: true }, { status: 201 });
}

/** Load a saved snapshot by slug (unwrapped to the SiteSnapshot shape). */
export async function GET(_request: Request, ctx: Ctx): Promise<Response> {
  const { slug } = await ctx.params;
  const snapshot = await readSnapshot(slug);

  if (!snapshot) {
    return Response.json({ error: "No published theme found for this slug." }, { status: 404 });
  }
  return Response.json(snapshot);
}

/** Parse JSON without throwing; returns `null` on malformed input. */
function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
