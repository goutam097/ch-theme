"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroSchema, type HeroFormValues } from "@/lib/schemas";
import { useAppDispatch } from "@/store/hooks";
import { updateHero } from "@/store/slices/websiteSlice";
import { useSiteContent } from "@/hooks/useSite";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectOption from "../ui/SelectOption";

const see_list = [{ value: "image", label: "Add Image" }, { value: "video", label: "Add Video" }, { value: "Carousel", label: "Add Carousel" }];

export function HeroEditor() {
  const hero = useSiteContent().hero;
  const dispatch = useAppDispatch();

  const [mediaType, setMediaType] = useState("image");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [carouselPreview, setCarouselPreview] = useState<string[]>([]);

  const { register, watch, setValue, formState: { errors } } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    mode: "onChange",
    defaultValues: {
      ...hero,
      carousel: hero.carousel ?? [],
    },
  });

  useEffect(() => {
    const sub = watch((values) => {
      dispatch(updateHero(values as Partial<HeroFormValues>));
    });
    return () => sub.unsubscribe();
  }, [watch, dispatch]);

  const carousel = watch("carousel") ?? [];

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result as string;

      setImagePreview(image);

      setValue("image", image, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setVideoPreview(url);

    setValue("video", url, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleCarouselUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    const images: string[] = [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        images.push(reader.result as string);

        if (images.length === files.length) {
          setCarouselPreview(images);

          setValue("carousel", images, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      };

      reader.readAsDataURL(file);
    });
  };

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
              const selected = value as string;

              setMediaType(selected);

              // Clear previous values
              setImagePreview(null);
              setVideoPreview(null);
              setCarouselPreview([]);

              setValue("image", "");
              setValue("video", "");
              setValue("carousel", []);
            }}
          />
        </div>
        <div className="space-y-4">
          {mediaType === "image" && (
            <>
              <Field label="Banner Image">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Field>

              {imagePreview && (
                <img
                  src={imagePreview}
                  className="mt-3 h-48 rounded object-cover"
                />
              )}
            </>
          )}

          {mediaType === "video" && (
            <>
              <Field label="Banner Video">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                />
              </Field>

              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="mt-3 h-56 rounded"
                />
              )}
            </>
          )}

          {mediaType === "Carousel" && (
            <>
              <Field label="Carousel Images">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleCarouselUpload}
                />
              </Field>

              <div className="mt-4 flex flex-wrap gap-3">
                {carouselPreview.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="h-28 w-28 rounded object-cover"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
