"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues } from "@/lib/schemas";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormSync } from "./useFormSync";
import type { ContactData } from "@/types";

/** Edits ONE contact block. The owner decides which page/block that is. */
export function ContactEditor({
  data,
  onChange,
}: {
  data: ContactData;
  onChange: (value: ContactData) => void;
}) {
  const { register, watch, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: data,
  });

  useFormSync<ContactFormValues, ContactData>(watch, onChange);

  return (
    <form className="space-y-5">
      <Field label="Phone" error={errors.phone?.message}>
        <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <Input {...register("email")} type="email" placeholder="hello@example.com" />
      </Field>
      <Field label="Address" error={errors.address?.message}>
        <Textarea {...register("address")} rows={2} placeholder="Street, City, State" />
      </Field>
      <Field label="Map embed URL" hint="Google Maps embed link — used by variants with a map." error={errors.mapUrl?.message}>
        <Input {...register("mapUrl")} placeholder="https://www.google.com/maps?q=…&output=embed" />
      </Field>
    </form>
  );
}
