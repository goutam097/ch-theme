"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroSchema, type HeroFormValues } from "@/lib/schemas";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaField } from "@/components/ui/media-field";
import SelectOption from "../ui/SelectOption";
import { useFormSync } from "./useFormSync";
import type { HeroData } from "@/types";

const see_list = [
  { value: "image", label: "Add Image" },
  { value: "video", label: "Add Video" },
  { value: "Carousel", label: "Add Carousel" },
];

/** Edits ONE hero block. The owner decides which page/block that is. */
export function HeroEditor({
  data,
  onChange,
}: {
  data: HeroData;
  onChange: (value: HeroData) => void;
}) {
  const [mediaType, setMediaType] = useState(() => {
    if (data.video) return "video";
    if (data.carousel?.length) return "Carousel";
    return "image";
  });

  const { register, watch, setValue, formState: { errors } } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    mode: "onChange",
    defaultValues: {
      ...data,
      carousel: data.carousel ?? [],
    },
  });

  useFormSync<HeroFormValues, HeroData>(watch, onChange);

  const opts = { shouldDirty: true, shouldValidate: true } as const;

  return (
    <form className="space-y-5">
      <Field label="Title" error={errors.title?.message}>
        <Input {...register("title")} placeholder="Headline" />
      </Field>

      <Field label="Subtitle" error={errors.subtitle?.message} hint="Small eyebrow text above the title.">
        <Input {...register("subtitle")} placeholder="Short tagline" />
      </Field>

      <Field label="Description" error={errors.description?.message}>
        <Textarea {...register("description")} rows={4} placeholder="Describe your offer" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Button text" error={errors.buttonText?.message}>
          <Input {...register("buttonText")} placeholder="Get started" />
        </Field>
        <Field label="Button link" error={errors.buttonLink?.message}>
          <Input {...register("buttonLink")} placeholder="#contact" />
        </Field>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <p className="mb-3 text-xs font-medium text-zinc-500">
          Media — each variant uses whichever of these it needs.
        </p>
        <div>
          <SelectOption
            options={see_list}
            value={mediaType}
            onChange={(value) => {
              setMediaType(value as string);

              // Only one media kind is live at a time, so clear the others.
              setValue("image", "", opts);
              setValue("video", "", opts);
              setValue("carousel", [], opts);
            }}
          />
        </div>
        <div className="space-y-4">
          {mediaType === "image" && (
            <MediaField
              label="Banner Image"
              error={errors.image?.message}
              value={watch("image") ?? ""}
              onChange={(value) => setValue("image", value, opts)}
            />
          )}

          {mediaType === "video" && (
            <MediaField
              label="Banner Video"
              kind="video"
              error={errors.video?.message}
              value={watch("video") ?? ""}
              onChange={(value) => setValue("video", value, opts)}
            />
          )}

          {mediaType === "Carousel" && (
            <MediaField
              label="Carousel Images"
              multiple
              hint="Upload several at once, or add them one URL at a time."
              error={errors.carousel?.message}
              value={watch("carousel") ?? []}
              onChange={(value) => setValue("carousel", value, opts)}
            />
          )}
        </div>
      </div>
    </form>
  );
}
