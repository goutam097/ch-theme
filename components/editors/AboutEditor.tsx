"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aboutSchema, type AboutFormValues } from "@/lib/schemas";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaField } from "@/components/ui/media-field";
import { useFormSync } from "./useFormSync";
import type { AboutData } from "@/types";

/** Edits ONE about block. The owner decides which page/block that is. */
export function AboutEditor({
  data,
  onChange,
}: {
  data: AboutData;
  onChange: (value: AboutData) => void;
}) {
  const { register, watch, setValue, formState: { errors } } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    mode: "onChange",
    defaultValues: data,
  });

  useFormSync<AboutFormValues, AboutData>(watch, onChange);

  return (
    <form className="space-y-5">
      <Field label="Title" error={errors.title?.message}>
        <Input {...register("title")} placeholder="About us" />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <Textarea {...register("description")} rows={6} placeholder="Tell your story" />
      </Field>
      <MediaField
        label="Image"
        hint="Paste a URL or upload one. Hidden automatically by text-only variants."
        error={errors.image?.message}
        value={watch("image") ?? ""}
        onChange={(value) => setValue("image", value, { shouldDirty: true, shouldValidate: true })}
      />
    </form>
  );
}
