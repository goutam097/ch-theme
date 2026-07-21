"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsFormValues } from "@/lib/schemas";
import { useAppDispatch } from "@/store/hooks";
import { updateSettings } from "@/store/slices/settingsSlice";
import { useSettings } from "@/hooks/useSite";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function SettingsEditor() {
  const settings = useSettings();
  const dispatch = useAppDispatch();

  const { register, handleSubmit, watch, formState: { errors, isDirty, isSubmitSuccessful } } =
    useForm<SettingsFormValues>({
      resolver: zodResolver(settingsSchema),
      defaultValues: {
        siteName: settings.siteName,
        slug: settings.slug,
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        favicon: settings.favicon ?? "",
        socialImage: settings.socialImage ?? "",
      },
    });

  const onSubmit = (values: SettingsFormValues) => {
    dispatch(updateSettings(values));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5">
      <Field label="Site name" error={errors.siteName?.message}>
        <Input {...register("siteName")} />
      </Field>
      {/* The slug comes from the signed-in account, not the site name — the
          published site and the API-backed sections are both keyed on it, so
          it isn't editable here. */}
      <Field
        label="Slug"
        hint={
          watch("slug")
            ? `Your site is published at /${watch("slug")} — it comes from your account.`
            : "Sign in to get your account slug."
        }
        error={errors.slug?.message}
      >
        <Input {...register("slug")} readOnly className="bg-zinc-50 text-zinc-500" />
      </Field>
      <Field label="SEO title" error={errors.seoTitle?.message}>
        <Input {...register("seoTitle")} />
      </Field>
      <Field label="SEO description" error={errors.seoDescription?.message}>
        <Textarea {...register("seoDescription")} rows={3} />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Favicon URL" error={errors.favicon?.message}>
          <Input {...register("favicon")} placeholder="https://…" />
        </Field>
        <Field label="Social share image" error={errors.socialImage?.message}>
          <Input {...register("socialImage")} placeholder="https://…" />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!isDirty}>Save settings</Button>
        {isSubmitSuccessful && !isDirty && (
          <span className="text-sm text-green-600">Saved</span>
        )}
      </div>
    </form>
  );
}
