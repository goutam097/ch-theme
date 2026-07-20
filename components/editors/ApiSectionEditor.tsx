"use client";

import { useEffect, useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ApiSectionData } from "@/types";

/**
 * Editor for an API-backed section (Events, Groups, My Videos, Podcast, Audio).
 *
 * These sections don't hold their items — the list is fetched live from the
 * backend when the section renders (see `lib/section-api.ts`). So the only thing
 * to edit here is the source `slug` that says WHICH collection to pull. There is
 * deliberately no manual item list: the content always mirrors the API.
 */
export function ApiSectionEditor({
  label,
  data,
  onChange,
}: {
  /** Human name of the section, e.g. "Events" — used in the hint text. */
  label: string;
  data: ApiSectionData;
  onChange: (value: ApiSectionData) => void;
}) {
  const [slug, setSlug] = useState(data.slug || "");

  useEffect(() => {
    const savedSlug = typeof window !== "undefined" ? window.localStorage.getItem("auth_profile") : null;
    if (savedSlug) {
      try {
        const parsed = JSON.parse(savedSlug);
        const fallback = parsed?.slug || parsed?.data?.slug || parsed?.user?.slug || "";
        if (fallback) {
          setSlug(fallback);
          onChange({ ...data, slug: fallback });
        }
      } catch {
        // Ignore invalid JSON.
      }
    }
  }, [data, onChange]);

  return (
    <div className="space-y-3">
      <Field
        label="Source slug"
        hint={`The ${label.toLowerCase()} are loaded from the API for this slug — e.g. test999. Items aren't edited here; they always mirror the API response.`}
      >
        <Input
          value={slug}
          onChange={(e) => {
            const nextValue = e.target.value;
            setSlug(nextValue);
            onChange({ ...data, slug: nextValue });
          }}
          placeholder="test999"
        />
      </Field>
    </div>
  );
}
