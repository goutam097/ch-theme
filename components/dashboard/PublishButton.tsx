"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, Globe, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { publishSite } from "@/store/slices/settingsSlice";
import { useSettings, useSiteSnapshot } from "@/hooks/useSite";
import { useHydrated } from "@/hooks/useHydrated";
import { saveSiteTheme } from "@/lib/site-api";
import { countBase64Assets, uploadSnapshotAssets } from "@/lib/asset-upload";
import { Button } from "@/components/ui/button";

/**
 * Publish action. Saves the whole site as a JSON snapshot
 * ({templateId, content, settings}) to the backend via the /api/sites proxy,
 * then flips local status to "published". The public site at /<slug>
 * fetches that snapshot back by slug and renders it.
 */
export function PublishButton() {
  const settings = useSettings();
  const snapshot = useSiteSnapshot();
  const dispatch = useAppDispatch();
  // Persisted status is client-only; treat as draft until hydrated to keep the
  // server and first client render identical (avoids a hydration mismatch).
  const hydrated = useHydrated();
  const isPublished = hydrated && settings.status === "published";
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<"uploading" | "saving" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setBusy(true);
    setError(null);
    // Stamp the snapshot as published *before* saving, so the stored copy the
    // public page reads back is already marked live.
    const publishedAt = new Date().toISOString();
    const published = {
      ...snapshot,
      settings: { ...snapshot.settings, status: "published" as const, publishedAt },
    };
    try {
      // 1. Upload any embedded base64 files to S3, swapping them for URLs, so
      //    the backend payload only carries lightweight S3 links.
      setPhase(countBase64Assets(published) > 0 ? "uploading" : "saving");
      const withUrls = await uploadSnapshotAssets(published);
      // 2. Send the (now URL-only) snapshot to the backend.
      setPhase("saving");
      await saveSiteTheme(withUrls);
      dispatch(publishSite(publishedAt));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publishing failed.");
    } finally {
      setBusy(false);
      setPhase(null);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {isPublished && (
          <Link
            href={`/${settings.slug}`}
            target="_blank"
            className="hidden items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 sm:flex"
          >
            <ExternalLink className="h-4 w-4" /> View live
          </Link>
        )}
        <Button onClick={handlePublish} disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPublished ? (
            <Check className="h-4 w-4" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          {phase === "uploading"
            ? "Uploading images…"
            : phase === "saving"
              ? "Publishing…"
              : isPublished
                ? "Republish"
                : "Publish"}
        </Button>
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
