import { z } from "zod";

/**
 * Zod schemas mirror the master data model and power every dashboard editor
 * form through `@hookform/resolvers/zod`. Optional media fields accept an empty
 * string (a cleared input) or a valid URL/path.
 */

const optionalUrl = z
  .string()
  .trim()
  .max(2048)
  .optional()
  .or(z.literal(""));

export const heroSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  subtitle: z.string().max(160),
  description: z.string().min(1, "Description is required").max(600),
  image: optionalUrl,
  video: optionalUrl,
  carousel: z.array(z.string().trim()),
  buttonText: z.string().max(40).optional().or(z.literal("")),
  buttonLink: optionalUrl,
});

export const aboutSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().min(1, "Description is required").max(1200),
  image: optionalUrl,
});

export const serviceItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(80),
  description: z.string().min(1, "Description is required").max(400),
  image: optionalUrl,
});

export const servicesSchema = z.object({
  items: z.array(serviceItemSchema).min(1, "Add at least one service"),
});

export const galleryItemSchema = z.object({
  image: z.string().min(1, "Image is required"),
});

export const gallerySchema = z.object({
  items: z.array(galleryItemSchema),
});

export const contactSchema = z.object({
  phone: z.string().min(1, "Phone is required").max(40),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(1, "Address is required").max(200),
  mapUrl: optionalUrl,
});

export const headerSchema = z.object({
  logoText: z.string().max(60).optional().or(z.literal("")),
  logoImage: optionalUrl,
  menuItems: z.array(z.string().min(1).max(40)).optional(),
});

export const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(80),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  seoTitle: z.string().max(70),
  seoDescription: z.string().max(160),
  favicon: optionalUrl,
  socialImage: optionalUrl,
});

export type HeroFormValues = z.infer<typeof heroSchema>;
export type AboutFormValues = z.infer<typeof aboutSchema>;
export type ServicesFormValues = z.infer<typeof servicesSchema>;
export type GalleryFormValues = z.infer<typeof gallerySchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type HeaderFormValues = z.infer<typeof headerSchema>;
export type SettingsFormValues = z.infer<typeof settingsSchema>;
