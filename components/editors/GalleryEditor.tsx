"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { gallerySchema, type GalleryFormValues } from "@/lib/schemas";
import { fetchGalleryFromApi } from "@/lib/gallery-api";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormSync } from "./useFormSync";
import type { GalleryItem } from "@/types";

/** Where the gallery images come from. */
type GallerySource = "manual" | "api";

/** Edits ONE gallery block — an array of images. */
export function GalleryEditor({
  data,
  onChange,
}: {
  data: GalleryItem[];
  onChange: (value: GalleryItem[]) => void;
}) {
  const [source, setSource] = useState<GallerySource>("manual");

  const { register, control, watch, reset, formState: { errors } } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    mode: "onChange",
    defaultValues: { items: data },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useFormSync<GalleryFormValues, { items?: GalleryItem[] }>(watch, (values) => {
    if (values.items) onChange(values.items);
  });

  return (
    <div className="space-y-4">
      {/* --- Source toggle: choose images manually or fetch them from the API --- */}
      <div className="flex gap-2 rounded-lg bg-zinc-100 p-1">
        {(["manual", "api"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setSource(value)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              source === value ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800",
            )}
          >
            {value === "manual" ? "Manual" : "From API"}
          </button>
        ))}
      </div>

      {source === "api" && (
        <ApiFetchPanel
          onLoaded={(items) => {
            // Push up to the store AND into the form so the results become editable rows.
            onChange(items);
            reset({ items });
            setSource("manual");
          }}
        />
      )}

      <form className="space-y-3">
        {fields.map((field, i) => (
          <div key={field.id} className="flex items-end gap-2">
            <Field label={`Image ${i + 1}`} className="flex-1" error={errors.items?.[i]?.image?.message}>
              <Input {...register(`items.${i}.image`)} placeholder="https://…" />
            </Field>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(i)}
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => append({ image: "" })}
        >
          <Plus className="h-4 w-4" /> Add image
        </Button>
      </form>
    </div>
  );
}

/** Slug + page inputs and a Fetch button that pulls images from the album API. */
function ApiFetchPanel({ onLoaded }: { onLoaded: (items: GalleryItem[]) => void }) {
  const [slug, setSlug] = useState("");
  const [page, setPage] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFetch() {
    setLoading(true);
    setError(null);
    try {
      const { items } = await fetchGalleryFromApi(slug, Number(page) || 1);
      onLoaded(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <div className="flex items-end gap-2">
        <Field label="Album slug" className="flex-1" hint="e.g. test999">
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="test999"
          />
        </Field>
        <Field label="Page" className="w-20">
          <Input
            type="number"
            min={1}
            value={page}
            onChange={(e) => setPage(e.target.value)}
          />
        </Field>
      </div>

      <Button type="button" className="w-full" onClick={handleFetch} disabled={loading || !slug.trim()}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Fetching…" : "Fetch photos"}
      </Button>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      <p className="text-xs text-zinc-400">
        Fetched images replace the current list and stay fully editable below.
      </p>
    </div>
  );
}
