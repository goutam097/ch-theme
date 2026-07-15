/**
 * ============================================================================
 * API-BACKED SECTIONS PROXY — Server-side proxy for the content backend.
 * ============================================================================
 *
 * Serves the Events, Groups, My Videos, Podcast and Audio sections. The upstream
 * backend (shanviatechdev.com) sends no CORS headers, so the browser can't call
 * it directly; this Route Handler runs on the server, fetches the collection for
 * a `slug`, and re-shapes it into the item types in `lib/section-api.ts` — the
 * exact shape each section variant renders. Same pattern as `/api/gallery`.
 *
 *   GET /api/sections/event?slug=bholanathdasf0546v
 *   GET /api/sections/audio?slug=bholanathdasf0546v   (etc.)
 *
 * The endpoint paths and field mappings below match the real backend responses.
 * `audio`, `video` and `event` shapes are confirmed against live data; `podcast`
 * and `group` returned empty collections for the sample account, so their item
 * fields are mapped defensively (common aliases) until a populated response is
 * seen — adjust the pick() lists in their mappers if a field name differs.
 */

import {
  DEFAULT_WAVEFORM,
  type AudioTrackItem,
  type EventItem,
  type GroupItem,
  type SectionKind,
  type VideoItem,
} from "@/lib/section-api";

/** Base URL of the upstream content service — same host/version as the gallery. */
const UPSTREAM_BASE = "https://shanviatechdev.com/api/v1";

/** Upstream URL per section kind, built from the collection `slug`. */
const ENDPOINTS: Record<SectionKind, (slug: string) => string> = {
  audio: (s) => `${UPSTREAM_BASE}/audio/audio-list-by-user-unauthorized/${encodeURIComponent(s)}`,
  video: (s) => `${UPSTREAM_BASE}/video/list-by-channel-unauthorized/${encodeURIComponent(s)}/1?limit=10`,
  podcast: (s) => `${UPSTREAM_BASE}/podcast/list-by-slug-unauthorize/${encodeURIComponent(s)}?pageNo=1&limit=6`,
  group: (s) => `${UPSTREAM_BASE}/group/group-list-by-slug-unauthorize/${encodeURIComponent(s)}?type=all`,
  event: (s) => `${UPSTREAM_BASE}/event/hosted-by-me-unauthorized/${encodeURIComponent(s)}`,
};

/** A loosely-typed record — upstream field names aren't statically known. */
type Raw = Record<string, unknown>;

/** Coerce any value to a trimmed string ("" for null/undefined/objects). */
function str(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

/** First non-empty string among the given keys (handles aliased field names). */
function pick(obj: Raw, ...keys: string[]): string {
  for (const k of keys) {
    const val = str(obj[k]);
    if (val) return val;
  }
  return "";
}

/** First finite number among the given keys, else 0. */
function num(obj: Raw, ...keys: string[]): number {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() && Number.isFinite(Number(v))) return Number(v);
  }
  return 0;
}

/** A stable id: the upstream id if any, else a positional fallback. */
function idOf(obj: Raw, index: number): string {
  return pick(obj, "_id", "id", "event_id", "uuid", "slug") || String(index);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** ISO date string → "Apr 24, 2026". Returns "" for missing/invalid input. */
function formatDate(v: unknown): string {
  const s = str(v);
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Duration → "m:ss". Accepts a seconds number or an already-formatted string. */
function formatDuration(v: unknown): string {
  if (typeof v === "number" && Number.isFinite(v)) {
    const m = Math.floor(v / 60);
    const s = Math.floor(v % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return str(v);
}

function asArray(v: unknown): Raw[] {
  return Array.isArray(v) ? (v as Raw[]) : [];
}

/** Pull the item rows out of an upstream payload for a given kind. */
function rowsFor(kind: SectionKind, payload: unknown): Raw[] {
  const data = ((payload ?? {}) as Raw).data;

  if (kind === "group") return asArray((data as Raw)?.list);
  if (kind === "event") {
    const d = (data ?? {}) as Raw;
    return [
      ...asArray(d.allEvents),
      ...asArray(d.upcomingEvents),
      ...asArray(d.liveEvents),
    ];
  }
  // audio, video, podcast return the rows directly under `data`.
  return asArray(data);
}

/** Re-shape one upstream row into the app's item type for `kind`. */
function mapRow(kind: SectionKind, r: Raw, i: number): EventItem | GroupItem | VideoItem | AudioTrackItem {
  switch (kind) {
    case "event": {
      const interested = num(r, "interestedCount");
      return {
        id: idOf(r, i),
        image: pick(r, "cover_photo", "image", "thumbnail"),
        title: pick(r, "event_name", "title", "name"),
        channel: pick(r, "creator_full_name", "channel", "organizer"),
        views: `${interested} interested`,
        release: formatDate(r.start_date ?? r.createdAt ?? r.date),
      } satisfies EventItem;
    }
    case "group": {
      const members = num(r, "memberCount", "members_count", "total_members", "totalMembers", "members");
      return {
        id: idOf(r, i),
        image: pick(r, "image", "cover_photo", "thumbnail", "group_image", "logo"),
        title: pick(r, "name", "group_name", "title"),
        members: members ? `${members} members` : pick(r, "membersText"),
      } satisfies GroupItem;
    }
    case "video": {
      return {
        id: idOf(r, i),
        image: pick(r, "thumbnail", "image", "cover_photo"),
        title: pick(r, "title", "name"),
        // `code` is the backend's video id; use it to enable the play control.
        youtubeId: pick(r, "youtube_id", "youtubeId", "code"),
        date: formatDate(r.createdAt ?? r.date),
        location: pick(r, "location", "place", "venue"),
      } satisfies VideoItem;
    }
    case "audio":
    case "podcast":
    default: {
      return {
        id: idOf(r, i),
        image: pick(r, "image", "thumbnail", "cover_photo", "cover"),
        title: pick(r, "title", "name"),
        subtitle: pick(r, "language", "description", "artist", "author", "subtitle"),
        date: formatDate(r.createdAt ?? r.date),
        // The backend has no waveform image, so use a shared generated one.
        waveform: pick(r, "waveform", "wave") || DEFAULT_WAVEFORM,
        duration: formatDuration(r.duration ?? r.length),
      } satisfies AudioTrackItem;
    }
  }
}

/** Type guard: is this a section kind we serve? */
function isSectionKind(value: string): value is SectionKind {
  return value in ENDPOINTS;
}

export async function GET(
  request: Request,
  ctx: { params: Promise<{ kind: string }> },
): Promise<Response> {
  const { kind } = await ctx.params;
  if (!isSectionKind(kind)) {
    return Response.json({ error: `Unknown section "${kind}".` }, { status: 404 });
  }

  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) {
    return Response.json({ error: "A slug is required." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(ENDPOINTS[kind](slug), {
      headers: { Accept: "application/json" },
      // Content can change upstream, so never serve a stale cached copy.
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { error: "Could not reach the content service. Please try again." },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    return Response.json(
      { error: `Content service returned ${upstream.status}.` },
      { status: 502 },
    );
  }

  let payload: unknown;
  try {
    payload = await upstream.json();
  } catch {
    return Response.json(
      { error: "Content service sent an invalid response." },
      { status: 502 },
    );
  }

  const items = rowsFor(kind, payload)
    .map((row, i) => mapRow(kind, row, i))
    // Drop rows with no image AND no title — almost certainly not real content.
    .filter((item) => item.image || item.title);

  return Response.json({ items });
}
