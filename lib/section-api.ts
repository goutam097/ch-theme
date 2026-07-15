/**
 * ============================================================================
 * API-BACKED SECTIONS — Shared item types + client fetch helper.
 * ============================================================================
 *
 * The Events, Groups, My Videos, Podcast and Audio sections never store their
 * items in the site content. A block of these types keeps only a source `slug`
 * (see `ApiSectionData` in `types/content.ts`); the item list is fetched LIVE at
 * render time from our own `/api/sections/<kind>` proxy.
 *
 * WHY A PROXY: the upstream backend (shanviatechdev.com) sends no CORS headers,
 * so the browser can't call it directly — exactly like the gallery. The proxy
 * runs server-side, fetches upstream, and re-shapes the response into the item
 * types below, which is what each section variant renders.
 */

/** One entry in an Events section. */
export interface EventItem {
  id: string;
  image: string;
  title: string;
  channel: string;
  views: string;
  release: string;
}

/** One entry in a Groups section. */
export interface GroupItem {
  id: string;
  image: string;
  title: string;
  members: string;
}

/** One entry in a My Videos section. */
export interface VideoItem {
  id: string;
  image: string;
  title: string;
  /** YouTube id used to enable/build the play button; may be empty. */
  youtubeId: string;
  date: string;
  location: string;
}

/** One track — Podcast and Audio share the same shape. */
export interface AudioTrackItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  date: string;
  /** Waveform image URL shown next to the play control. */
  waveform: string;
  duration: string;
}

/** Maps each section kind to the item type its API returns. */
export interface SectionItemMap {
  event: EventItem;
  group: GroupItem;
  video: VideoItem;
  podcast: AudioTrackItem;
  audio: AudioTrackItem;
}

/** The API-backed section kinds — one per block type that fetches its content. */
export type SectionKind = keyof SectionItemMap;

/**
 * A generic bar waveform as an inline SVG data URI. The audio/podcast backend
 * returns no waveform image, so the Audio/Podcast variants render this instead —
 * shared here so both the proxy mapper and the sample data use the same graphic.
 */
export const DEFAULT_WAVEFORM = (() => {
  const heights = [
    18, 34, 52, 28, 46, 66, 40, 22, 50, 62, 30, 48, 58, 36, 26, 54, 68, 42, 24,
    46, 60, 32, 44, 56, 28, 64, 38, 50, 60, 30, 44, 54, 26, 48, 62, 34,
  ];
  const bars = heights
    .map((h, i) => {
      const x = i * 14;
      const y = (80 - h) / 2;
      return `<rect x="${x}" y="${y}" width="7" height="${h}" rx="3" fill="#111111"/>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${heights.length * 14}" height="80">${bars}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
})();

/**
 * Fetch the items for one API-backed section via our `/api/sections/<kind>`
 * proxy. Returns `[]` for an empty slug or ANY failure: these sections sit
 * inside a page the visitor is already looking at, so a bad fetch should render
 * nothing rather than throw and blank the whole page.
 */
export async function fetchSectionItems<K extends SectionKind>(
  kind: K,
  slug: string,
): Promise<SectionItemMap[K][]> {
  const trimmed = slug.trim();
  if (!trimmed) return [];

  const params = new URLSearchParams({ slug: trimmed });

  let res: Response;
  try {
    res = await fetch(`/api/sections/${kind}?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    return [];
  }

  if (!res.ok) return [];

  const body = (await res.json().catch(() => null)) as
    | { items?: SectionItemMap[K][] }
    | null;

  return body?.items ?? [];
}
