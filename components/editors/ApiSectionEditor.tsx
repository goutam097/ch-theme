"use client";

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
  return (
    <div className="space-y-3">
      <Field
        label="Source slug"
        hint={`The ${label.toLowerCase()} are loaded from the API for this slug — e.g. test999. Items aren't edited here; they always mirror the API response.`}
      >
        <Input
          value={data.slug}
          onChange={(e) => onChange({ ...data, slug: e.target.value })}
          placeholder="test999"
        />
      </Field>
    </div>
  );
}
