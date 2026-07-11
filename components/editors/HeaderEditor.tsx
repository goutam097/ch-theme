"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { headerSchema, type HeaderFormValues } from "@/lib/schemas";
import { useAppDispatch } from "@/store/hooks";
import { updateHeader } from "@/store/slices/websiteSlice";
import { useSiteContent } from "@/hooks/useSite";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectOption from "../ui/SelectOption";

const see_list = [{ value: "logo", label: "Add Logo" }, { value: "text", label: "Add Text" }];

export function HeaderEditor() {
  const content = useSiteContent();
  const header = content?.header || { logoText: "MyWebsite", logoPic: "", menuItems: ["Home", "About", "Services", "Gallery", "Contact"] };
  const dispatch = useAppDispatch();
  const [addLogo, setAddLogo] = useState("logo");
  const [logoPic, setLogoPic] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { register, watch, setValue, formState: { errors } } = useForm<HeaderFormValues>({
    resolver: zodResolver(headerSchema),
    mode: "onChange",
    defaultValues: {
      logoText: header?.logoText || "MyWebsite",
      logoImage: header?.logoImage || "",
      menuItems: header?.menuItems || ["Home", "About", "Services", "Gallery", "Contact"],
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      dispatch(updateHeader(values as Partial<HeaderFormValues>));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const menuItems = watch("menuItems") ?? [];

  const handleAddMenu = () => {
    if (menuItems.length >= 5) return;

    setValue("menuItems", [...menuItems, ""], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleMenuChange = (index: number, value: string) => {
    const updated = [...menuItems];
    updated[index] = value;

    setValue("menuItems", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemoveMenu = (index: number) => {
    const updated = menuItems.filter((_, i) => i !== index);

    setValue("menuItems", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleProfilePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Please select an image file");
      return;
    }
    setLogoFile(file);

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

  return (
    <form className="space-y-5">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <p className="mb-4 text-xs font-medium text-zinc-500">
          Logo — choose text, image, or both
        </p>
        <div>
          <SelectOption options={see_list} value={addLogo} onChange={(value) => {
            const selected = value as string;

            setAddLogo(selected);

            if (selected === "text") {
              // Remove logo
              setLogoPic(null);
              setLogoFile(null);

              setValue("logoImage", "", {
                shouldDirty: true,
                shouldValidate: true,
              });
            } else {
              // Remove text
              setValue("logoText", "", {
                shouldDirty: true,
                shouldValidate: true,
              });
            }
          }} />
        </div>
        <div className="space-y-4">
          {
            addLogo === 'text' ? (<Field label="Logo Text" error={errors.logoText?.message} hint="Your website's branding name.">
              <Input {...register("logoText")} placeholder="MyWebsite" />
            </Field>) : (
              <>
                <Field label="Logo Image URL" error={errors.logoImage?.message} hint="Logo image that appears alongside or instead of text.">
                  <input type="file" onChange={handleProfilePhotoUpload} accept="image/*" />
                </Field>
                {logoPic && (
                  <div className="mt-3 rounded-lg border border-zinc-200 p-3 bg-white">
                    <p className="mb-2 text-xs font-medium text-zinc-600">Preview:</p>
                    <img src={logoPic} alt="Logo preview" className="h-10 object-contain" />
                  </div>
                )}
              </>
            )
          }


        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <p className="mb-3 text-xs font-medium text-zinc-500">
          Navigation Menu — one item per line
        </p>
        <Field
          label="Menu Items"
          hint="Maximum 5 menu items."
          error={errors.menuItems?.message}
        >
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item}
                  placeholder={`Menu ${index + 1}`}
                  onChange={(e) => handleMenuChange(index, e.target.value)}
                />

                {menuItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMenu(index)}
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    −
                  </button>
                )}
              </div>
            ))}

            {menuItems.length < 5 && (
              <button
                type="button"
                onClick={handleAddMenu}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                + Add Menu
              </button>
            )}

            <p className="text-xs text-gray-500">
              {menuItems.length}/5 menu items
            </p>
          </div>
        </Field>
      </div>
    </form>
  );
}
