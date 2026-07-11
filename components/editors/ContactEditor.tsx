"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues } from "@/lib/schemas";
import { useAppDispatch } from "@/store/hooks";
import { updateContact } from "@/store/slices/websiteSlice";
import { useSiteContent } from "@/hooks/useSite";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactEditor() {
  const contact = useSiteContent().contact;
  const dispatch = useAppDispatch();

  const { register, watch, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: contact,
  });

  useEffect(() => {
    const sub = watch((values) => dispatch(updateContact(values as Partial<ContactFormValues>)));
    return () => sub.unsubscribe();
  }, [watch, dispatch]);

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
