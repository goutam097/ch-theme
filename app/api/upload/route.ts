/**
 * ============================================================================
 * UPLOAD PROXY — Send a base64 asset to the backend, get back an S3 URL.
 * ============================================================================
 *
 * The browser can't POST to the backend directly (no CORS). This Route Handler
 * receives `{ data, filename }` from the client (data = a base64 data URI),
 * forwards it to the backend's S3-upload endpoint, and returns `{ url }`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS THE SINGLE SOURCE OF TRUTH FOR THE UPLOAD CONTRACT.
 *   • UPLOAD_ENDPOINT   — the backend URL that stores a file in S3
 *   • toUploadBody()    — the request body shape the endpoint expects
 *   • extractUrl()      — where the S3 URL lives in the response
 * Adjust these three if the real backend differs; nothing else changes.
 * ─────────────────────────────────────────────────────────────────────────
 */

// TODO(backend): replace with the real S3-upload endpoint URL.
const UPLOAD_ENDPOINT = "http://localhost:5000/v1/temp-post/temp-image-upload";

/** Shape the request body the way the backend upload endpoint expects. */
function toUploadBody(data: string, filename: string): unknown {
  return { data, filename };
}

/** Find the uploaded S3 URL in whatever shape the backend returns. */
function extractUrl(payload: unknown): string | null {
  if (typeof payload === "string") return payload.startsWith("http") ? payload : null;
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  const data = (obj.data ?? {}) as Record<string, unknown>;

  const candidates = [
    obj.url,
    obj.Location, // raw S3 SDK response
    data.url,
    data.Location,
    typeof obj.data === "string" ? obj.data : undefined,
  ];
  const url = candidates.find((c) => typeof c === "string" && c.startsWith("http"));
  return (url as string) ?? null;
}

interface UploadRequest {
  data?: string;
  filename?: string;
}

export async function POST(request: Request): Promise<Response> {
  let payload: UploadRequest;
  try {
    payload = (await request.json()) as UploadRequest;
  } catch {
    return Response.json({ error: "Invalid upload request." }, { status: 400 });
  }

  const { data, filename } = payload;
  if (!data || !data.startsWith("data:")) {
    return Response.json({ error: "A base64 data URI is required." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(UPLOAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(toUploadBody(data, filename ?? "asset")),
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { error: "Could not reach the upload service." },
      { status: 502 },
    );
  }

  const body = await upstream.json().catch(() => null);
  const url = extractUrl(body);

  // if (!upstream.ok || !url) {
  //   return Response.json(
  //     { error: `Upload service did not return a URL (status ${upstream.status}).` },
  //     { status: 502 },
  //   );
  // }

  return Response.json({ url });
}
