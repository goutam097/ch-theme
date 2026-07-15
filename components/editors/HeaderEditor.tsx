"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { headerSchema, type HeaderFormValues } from "@/lib/schemas";
import { useAppDispatch } from "@/store/hooks";
import { updateHeader } from "@/store/slices/websiteSlice";
import { useSiteContent } from "@/hooks/useSite";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormSync } from "./useFormSync";
import SelectOption from "../ui/SelectOption";

const see_list = [
  { value: "logo", label: "Add Logo" },
  { value: "text", label: "Add Text" },
];

/**
 * Edits the header BRANDING (logo text / logo image).
 *
 * The navigation menu is NOT edited here any more. It's derived from the site's
 * pages, so it's managed on the Pages screen — a menu item and a page are the
 * same thing, and editing them in two places would let them drift apart.
 */
export function HeaderEditor() {
  const content = useSiteContent();
  const header = content.header;
  const dispatch = useAppDispatch();

  const [addLogo, setAddLogo] = useState(header.logoImage ? "logo" : "text");
  const [logoPic, setLogoPic] = useState<string | null>(header.logoImage || null);

  const { register, watch, setValue, formState: { errors } } = useForm<HeaderFormValues>({
    resolver: zodResolver(headerSchema),
    mode: "onChange",
    defaultValues: {
      logoText: header.logoText || "MyWebsite",
      logoImage: header.logoImage || "",
    },
  });

  useFormSync<HeaderFormValues, HeaderFormValues>(watch, (values) => {
    dispatch(updateHeader(values));
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const rawDataUrl = reader.result as string;

      // Downscale the logo to a small PNG so the resulting data URL stays tiny
      // enough to (a) persist in localStorage and (b) render fast in the preview.
      const img = new Image();
      img.onload = () => {
        const MAX = 240; // px on the longest edge
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Keep PNG to preserve logo transparency.
        const dataUrl = canvas.toDataURL("image/png");

        setLogoPic(dataUrl);
        setValue("logoImage", dataUrl, { shouldDirty: true });
        // Dispatch straight to the store so the live preview reflects the logo
        // immediately, independent of the react-hook-form watch subscription.
        dispatch(updateHeader({ logoImage: dataUrl }));
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const menuPages = content.pages.filter((p) => p.showInMenu);

  return (
    <form className="space-y-5">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <p className="mb-4 text-xs font-medium text-zinc-500">
          Logo — choose text or an image
        </p>
        <div>
          <SelectOption
            options={see_list}
            value={addLogo}
            onChange={(value) => {
              const selected = value as string;
              setAddLogo(selected);

              if (selected === "text") {
                // Remove logo image
                setLogoPic(null);
                setValue("logoImage", "", { shouldDirty: true, shouldValidate: true });
                dispatch(updateHeader({ logoImage: "" }));
              } else {
                // Remove text
                setValue("logoText", "", { shouldDirty: true, shouldValidate: true });
                dispatch(updateHeader({ logoText: "" }));
              }
            }}
          />
        </div>

        <div className="space-y-4">
          {addLogo === "text" ? (
            <Field label="Logo Text" error={errors.logoText?.message} hint="Your website's branding name.">
              <Input {...register("logoText")} placeholder="MyWebsite" />
            </Field>
          ) : (
            <>
              <Field label="Logo Image" error={errors.logoImage?.message} hint="Logo image shown in the header.">
                <input type="file" onChange={handleLogoUpload} accept="image/*" />
              </Field>
              {logoPic && (
                <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3">
                  <p className="mb-2 text-xs font-medium text-zinc-600">Preview:</p>
                  <img src={logoPic} alt="Logo preview" className="h-10 object-contain" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* The menu is the pages — show what's currently in it and link to where
          it's actually edited, so nobody hunts for a menu field that moved. */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <p className="mb-1 text-xs font-medium text-zinc-500">Navigation menu</p>
        <p className="mb-3 text-xs text-zinc-400">
          Your menu is built from your pages. Add, rename, reorder or hide a page
          and the menu follows.
        </p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {menuPages.length > 0 ? (
            menuPages.map((page) => (
              <span
                key={page.id}
                className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700"
              >
                {page.label}
              </span>
            ))
          ) : (
            <span className="text-xs text-zinc-400">No pages are shown in the menu.</span>
          )}
        </div>

        <Link
          href="/dashboard/pages"
          className="inline-flex rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
        >
          Manage pages &amp; menu
        </Link>
      </div>
    </form>
  );
}
