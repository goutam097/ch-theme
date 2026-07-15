"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { servicesSchema, type ServicesFormValues } from "@/lib/schemas";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFormSync } from "./useFormSync";
import type { ServiceItem } from "@/types";

/**
 * Edits ONE services block — an array of service items.
 *
 * The form wraps the array in `{ items }` because react-hook-form's
 * `useFieldArray` needs a named field; `onChange` unwraps it again so the owner
 * only ever sees the block's real shape (`ServiceItem[]`).
 */
export function ServicesEditor({
  data,
  onChange,
}: {
  data: ServiceItem[];
  onChange: (value: ServiceItem[]) => void;
}) {
  const { register, control, watch, formState: { errors } } = useForm<ServicesFormValues>({
    resolver: zodResolver(servicesSchema),
    mode: "onChange",
    defaultValues: { items: data },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useFormSync<ServicesFormValues, { items?: ServiceItem[] }>(watch, (values) => {
    if (values.items) onChange(values.items);
  });

  return (
    <form className="space-y-4">
      {fields.map((field, i) => (
        <div key={field.id} className="rounded-lg border border-zinc-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Service {i + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(i)}
              aria-label="Remove service"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <div className="space-y-3">
            <Field label="Title" error={errors.items?.[i]?.title?.message}>
              <Input {...register(`items.${i}.title`)} placeholder="Service name" />
            </Field>
            <Field label="Description" error={errors.items?.[i]?.description?.message}>
              <Textarea {...register(`items.${i}.description`)} rows={2} />
            </Field>
            <Field label="Image URL" error={errors.items?.[i]?.image?.message}>
              <Input {...register(`items.${i}.image`)} placeholder="https://…" />
            </Field>
          </div>
        </div>
      ))}

      {typeof errors.items?.message === "string" && (
        <p className="text-xs font-medium text-red-600">{errors.items.message}</p>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => append({ title: "", description: "", image: "" })}
      >
        <Plus className="h-4 w-4" /> Add service
      </Button>
    </form>
  );
}
