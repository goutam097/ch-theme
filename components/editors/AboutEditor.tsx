"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aboutSchema, type AboutFormValues } from "@/lib/schemas";
import { useAppDispatch } from "@/store/hooks";
import { updateAbout } from "@/store/slices/websiteSlice";
import { useSiteContent } from "@/hooks/useSite";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AboutEditor() {
  const about = useSiteContent().about;
  const dispatch = useAppDispatch();

  const { register, watch, formState: { errors } } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    mode: "onChange",
    defaultValues: about,
  });

  useEffect(() => {
    const sub = watch((values) => dispatch(updateAbout(values as Partial<AboutFormValues>)));
    return () => sub.unsubscribe();
  }, [watch, dispatch]);

  return (
    <form className="space-y-5">
      <Field label="Title" error={errors.title?.message}>
        <Input {...register("title")} placeholder="About us" />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <Textarea {...register("description")} rows={6} placeholder="Tell your story" />
      </Field>
      <Field label="Image URL" hint="Hidden automatically by text-only variants." error={errors.image?.message}>
        <Input {...register("image")} placeholder="https://…" />
      </Field>
    </form>
  );
}
