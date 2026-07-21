"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { headerSchema, type HeaderFormValues } from "@/lib/schemas";
import { useAppDispatch } from "@/store/hooks";
import { updateHeader } from "@/store/slices/websiteSlice";
import { useSiteContent } from "@/hooks/useSite";
import { getProfileImages } from "@/lib/auth-profile";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MediaField } from "@/components/ui/media-field";
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

  const profileImages = useMemo(() => getProfileImages(), []);

  // Only offer the saved images that actually exist on the profile.
  const options = useMemo(() => {
    const extra = [];
    if (profileImages.companyLogo) {
      extra.push({ value: "company_logo", label: "Use Company Logo" });
    }
    if (profileImages.profileIcon) {
      extra.push({ value: "profile_icon", label: "Use Profile Icon" });
    }
    return [...see_list, ...extra];
  }, [profileImages]);

  const [addLogo, setAddLogo] = useState(() => {
    if (!header.logoImage) return "text";
    if (header.logoImage === profileImages.companyLogo) return "company_logo";
    if (header.logoImage === profileImages.profileIcon) return "profile_icon";
    return "logo";
  });
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

  /**
   * Dispatch straight to the store as well as into the form, so the live
   * preview reflects the logo immediately rather than waiting on the
   * react-hook-form watch subscription.
   */
  const setLogoImage = (value: string) => {
    setValue("logoImage", value, { shouldDirty: true, shouldValidate: true });
    dispatch(updateHeader({ logoImage: value }));
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
            options={options}
            value={addLogo}
            onChange={(value) => {
              const selected = value as string;
              setAddLogo(selected);

              if (selected === "text") {
                // Remove logo image
                setLogoImage("");
                return;
              }

              // Remove text
              setValue("logoText", "", { shouldDirty: true, shouldValidate: true });
              dispatch(updateHeader({ logoText: "" }));

              // The saved-image options are ready to use straight away; "logo"
              // still waits for an upload.
              const saved =
                selected === "company_logo"
                  ? profileImages.companyLogo
                  : selected === "profile_icon"
                    ? profileImages.profileIcon
                    : "";

              if (saved) setLogoImage(saved);
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
              {addLogo === "logo" ? (
                <MediaField
                  label="Logo Image"
                  // A logo never renders large, so keep the stored data URL tiny.
                  maxDimension={240}
                  hint="Logo image shown in the header."
                  error={errors.logoImage?.message}
                  value={watch("logoImage") ?? ""}
                  onChange={setLogoImage}
                />
              ) : (
                watch("logoImage") && (
                  <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3">
                    <p className="mb-2 text-xs font-medium text-zinc-600">Preview:</p>
                    <img src={watch("logoImage")} alt="Logo preview" className="h-10 object-contain" />
                  </div>
                )
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
