"use client";

import { useEffect, useState } from "react";
import {
  fetchSectionItems,
  type SectionItemMap,
  type SectionKind,
} from "@/lib/section-api";

/**
 * Fetch an API-backed section's items for a source `slug`, at render time.
 *
 * Used by the Events / Groups / My Videos / Podcast / Audio variants. Runs on
 * mount and whenever the slug changes, so the dashboard preview updates as soon
 * as the user points the block at a different collection. Never throws — a bad
 * fetch simply yields an empty list (see `fetchSectionItems`).
 *
 * `loading` and `items` are DERIVED from the last fetched result rather than set
 * synchronously in the effect: while the fetched result's slug doesn't match the
 * current slug we report `loading` (a stale result is never shown), so switching
 * slugs shows the spinner again without a synchronous state reset.
 */
export function useSectionItems<K extends SectionKind>(
  kind: K,
  slug: string,
): { items: SectionItemMap[K][]; loading: boolean } {
  const trimmed = slug.trim();
  const [result, setResult] = useState<{
    slug: string;
    items: SectionItemMap[K][];
  }>({ slug: "", items: [] });

  useEffect(() => {
    if (!trimmed) return;

    let active = true;
    fetchSectionItems(kind, trimmed).then((items) => {
      if (active) setResult({ slug: trimmed, items });
    });

    return () => {
      active = false;
    };
  }, [kind, trimmed]);

  // Only trust a result whose slug matches what we're currently asking for.
  const ready = trimmed.length > 0 && result.slug === trimmed;
  return {
    items: ready ? result.items : [],
    loading: trimmed.length > 0 && !ready,
  };
}
