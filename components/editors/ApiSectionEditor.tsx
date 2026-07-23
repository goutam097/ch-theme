"use client";

import { useEffect, useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getProfileSlug } from "@/lib/auth-profile";
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
  // Defaults to the signed-in user's own slug, which is what these sections are
  // keyed on; an explicit slug already on the block always wins.
  const [slug, setSlug] = useState(() => data.slug || getProfileSlug());

  // Persist that default into the block so it survives without an edit.
  useEffect(() => {
    if (!data.slug && slug) onChange({ ...data, slug });
  }, [data, onChange, slug]);

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
