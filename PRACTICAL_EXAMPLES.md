# 🛠️ Practical Examples & How-To Guide

## Common Tasks & Step-by-Step Solutions

---

## Task 1: Add a New Header Variant (HeaderV6)

### Goal: Create a new header design option

### Step-by-Step:

#### Step 1: Create the Component
**File:** `templates/sections/header/HeaderV6.tsx`

```typescript
import { HeaderSectionProps } from "@/types/section-props";

export function HeaderV6({ data, theme }: HeaderSectionProps) {
  // Use data with fallbacks
  const logoText = data?.logoText || "MyWebsite";
  const menuItems = data?.menuItems || ["Home", "About", "Services"];
  const logoImage = data?.logoImage;

  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {logoImage && (
            <img 
              src={logoImage} 
              alt="Logo" 
              className="h-10 object-contain brightness-0 invert"
            />
          )}
          <span className="text-2xl font-bold">{logoText}</span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-8">
          {menuItems.map((item) => (
            <a 
              key={item}
              href="#" 
              className="font-semibold hover:opacity-80 transition"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100">
          Get Started
        </button>
      </div>
    </header>
  );
}

export default HeaderV6;
```

#### Step 2: Add to Registry
**File:** `templates/registry/sectionRegistry.ts`

```typescript
import HeaderV1 from "@/templates/sections/header/HeaderV1";
import HeaderV2 from "@/templates/sections/header/HeaderV2";
import HeaderV3 from "@/templates/sections/header/HeaderV3";
import HeaderV4 from "@/templates/sections/header/HeaderV4";
import HeaderV5 from "@/templates/sections/header/HeaderV5";
import HeaderV6 from "@/templates/sections/header/HeaderV6";  // ← Add import
// ... other imports

export const sectionRegistry = {
  // Header variants
  header_v1: HeaderV1,
  header_v2: HeaderV2,
  header_v3: HeaderV3,
  header_v4: HeaderV4,
  header_v5: HeaderV5,
  header_v6: HeaderV6,  // ← Add this line
  
  // ... rest of registry
};
```

#### Step 3: Use in a Template
**File:** `templates/configs/template1.ts` (or any template)

```typescript
export const Aurora = {
  name: "Aurora",
  home: {
    header: "header_v6",  // ← Change from header_v1 to header_v6
    hero: "hero_v1",
    about: "about_v1",
    services: "services_v1",
    gallery: "gallery_v1",
    contact: "contact_v1",
  },
};
```

#### Step 4: Test
1. Go to `/dashboard/preview`
2. See your new header design!
3. Edit header in `/dashboard/header`
4. Changes should reflect immediately

**That's it! ✅ No other changes needed.**

---

## Task 2: Add a New Form Field to Header

### Goal: Add a "tagline" field to header data

### Step-by-Step:

#### Step 1: Update Data Type
**File:** `types/content.ts`

```typescript
export interface HeaderData {
  logoText?: string;
  logoImage?: string;
  menuItems?: string[];
  tagline?: string;  // ← Add this line
}
```

#### Step 2: Update Validation Schema
**File:** `lib/schemas.ts`

```typescript
import { z } from "zod";

const optionalUrl = z.string().url().optional().or(z.literal(""));

export const headerSchema = z.object({
  logoText: z.string().max(60).optional().or(z.literal("")),
  logoImage: optionalUrl,
  menuItems: z.array(z.string().min(1).max(40)).optional(),
  tagline: z.string().max(100).optional().or(z.literal("")),  // ← Add this
});

export type HeaderFormValues = z.infer<typeof headerSchema>;
```

#### Step 3: Add to Redux Defaults
**File:** `data/default-content.ts`

```typescript
export const DEFAULT_CONTENT: SiteContent = {
  header: {
    logoText: "MyWebsite",
    logoImage: "",
    menuItems: ["Home", "About", "Services", "Gallery", "Contact"],
    tagline: "Your tagline here",  // ← Add this
  },
  // ... rest of content
};
```

#### Step 4: Add Form Input
**File:** `components/editors/HeaderEditor.tsx`

```typescript
export function HeaderEditor() {
  const content = useSiteContent();
  const header = content?.header || { 
    logoText: "MyWebsite", 
    logoImage: "", 
    menuItems: ["Home", "About"],
    tagline: "",  // ← Add default
  };
  
  const { register, watch, formState: { errors } } = useForm<HeaderFormValues>({
    resolver: zodResolver(headerSchema),
    mode: "onChange",
    defaultValues: {
      logoText: header?.logoText || "MyWebsite",
      logoImage: header?.logoImage || "",
      menuItems: header?.menuItems || ["Home", "About"],
      tagline: header?.tagline || "",  // ← Add this
    },
  });

  // ... watch setup ...

  return (
    <form className="space-y-5">
      {/* ... existing fields ... */}
      
      {/* Add new field */}
      <Field label="Tagline" error={errors.tagline?.message} hint="Short description under your logo.">
        <Input 
          {...register("tagline")} 
          placeholder="Your tagline here"
          maxLength={100}
        />
      </Field>
    </form>
  );
}
```

#### Step 5: Use in Components
**File:** `templates/sections/header/HeaderV1.tsx` (Update all 5!)

```typescript
export function HeaderV1({ data, theme }: HeaderSectionProps) {
  const logoText = data?.logoText || "MyWebsite";
  const tagline = data?.tagline;  // ← Add this
  const menuItems = data?.menuItems || ["Home", "About"];

  return (
    <header className="...">
      <div className="flex items-center gap-2">
        {data?.logoImage && <img src={data.logoImage} alt="Logo" />}
        
        <div>
          <div className="text-xl font-bold text-gray-900">{logoText}</div>
          {tagline && <div className="text-sm text-gray-600">{tagline}</div>}  {/* ← Add */}
        </div>
      </div>
      
      {/* ... navigation ... */}
    </header>
  );
}
```

#### Step 6: Test
1. Go to `/dashboard/header`
2. See new "Tagline" input field
3. Enter a tagline
4. Check preview - should show below logo
5. Refresh - should persist

**That's it! ✅ Redux handles the rest automatically.**

---

## Task 3: Add a New Section (e.g., "FAQ")

### Goal: Add FAQ section editing capability

### Step-by-Step:

#### Step 1: Define Data Type
**File:** `types/content.ts`

```typescript
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQData {
  title?: string;
  items?: FAQItem[];
}

export interface SiteContent {
  header: HeaderData;
  hero: HeroData;
  about: AboutData;
  services: ServicesData;
  gallery: GalleryData;
  contact: ContactData;
  faq: FAQData;  // ← Add this
}
```

#### Step 2: Add Template Type
**File:** `types/template.ts`

```typescript
export type SectionKey = 
  | "header" 
  | "hero" 
  | "about" 
  | "services" 
  | "gallery" 
  | "contact" 
  | "faq";  // ← Add this

export type FAQVariant = "faq_v1" | "faq_v2" | "faq_v3" | "faq_v4" | "faq_v5";

export const RENDER_ORDER: SectionKey[] = [
  "header",
  "hero",
  "about",
  "services",
  "gallery",
  "faq",  // ← Add this
  "contact",
];
```

#### Step 3: Add Section Props Type
**File:** `types/section-props.ts`

```typescript
export type FAQSectionProps = SectionComponentProps<FAQData>;
```

#### Step 4: Create Validation Schema
**File:** `lib/schemas.ts`

```typescript
export const faqSchema = z.object({
  title: z.string().max(100).optional().or(z.literal("")),
  items: z.array(
    z.object({
      question: z.string().min(3).max(200),
      answer: z.string().min(10).max(1000),
    })
  ).optional(),
});

export type FAQFormValues = z.infer<typeof faqSchema>;
```

#### Step 5: Add to Redux
**File:** `store/slices/websiteSlice.ts`

```typescript
export const websiteSlice = createSlice({
  name: "website",
  initialState,
  reducers: {
    // ... existing reducers ...
    updateFAQ: (state, action: PayloadAction<Partial<FAQData>>) => {
      state.faq = { ...state.faq, ...action.payload };
    },
  },
});

export const { updateHeader, updateHero, ..., updateFAQ } = websiteSlice.actions;
```

#### Step 6: Add to Default Content
**File:** `data/default-content.ts`

```typescript
export const DEFAULT_CONTENT: SiteContent = {
  // ... other sections ...
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { question: "How does this work?", answer: "It's simple..." },
      { question: "What's the price?", answer: "Starting at..." },
    ],
  },
};
```

#### Step 7: Create Components
**File:** `templates/sections/faq/FAQV1.tsx`

```typescript
import { FAQSectionProps } from "@/types/section-props";

export function FAQV1({ data, theme }: FAQSectionProps) {
  const title = data?.title || "Frequently Asked Questions";
  const items = data?.items || [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        
        <div className="space-y-6">
          {items.map((item, idx) => (
            <details 
              key={idx} 
              className="border border-gray-200 rounded-lg p-4 open:bg-blue-50"
            >
              <summary className="font-semibold cursor-pointer">
                {item.question}
              </summary>
              <p className="mt-3 text-gray-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQV1;
```

#### Step 8: Register Component
**File:** `templates/registry/sectionRegistry.ts`

```typescript
import FAQV1 from "@/templates/sections/faq/FAQV1";
import FAQV2 from "@/templates/sections/faq/FAQV2";
// ... etc for V3-V5

export const sectionRegistry = {
  // ... existing entries ...
  faq_v1: FAQV1,
  faq_v2: FAQV2,
  faq_v3: FAQV3,
  faq_v4: FAQV4,
  faq_v5: FAQV5,
};
```

#### Step 9: Create Editor
**File:** `components/editors/FAQEditor.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { faqSchema, type FAQFormValues } from "@/lib/schemas";
import { useAppDispatch } from "@/store/hooks";
import { updateFAQ } from "@/store/slices/websiteSlice";
import { useSiteContent } from "@/hooks/useSite";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function FAQEditor() {
  const content = useSiteContent();
  const faq = content?.faq || { title: "FAQ", items: [] };
  const dispatch = useAppDispatch();

  const { register, watch, formState: { errors } } = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    mode: "onChange",
    defaultValues: {
      title: faq?.title || "Frequently Asked Questions",
      items: faq?.items || [],
    },
  });

  useEffect(() => {
    const sub = watch((values) => {
      dispatch(updateFAQ(values as Partial<FAQFormValues>));
    });
    return () => sub.unsubscribe();
  }, [watch, dispatch]);

  return (
    <form className="space-y-5">
      <Field label="Title" error={errors.title?.message}>
        <Input {...register("title")} placeholder="Frequently Asked Questions" />
      </Field>

      {/* Items editor would go here */}
      {/* This is simplified - you'd build a more complex component */}
    </form>
  );
}
```

#### Step 10: Add Route
**File:** `app/dashboard/faq/page.tsx`

```typescript
import { EditorShell } from "@/components/dashboard/EditorShell";
import { FAQEditor } from "@/components/editors/FAQEditor";

export default function FAQEditorPage() {
  return (
    <EditorShell title="FAQ" description="Manage your frequently asked questions">
      <FAQEditor />
    </EditorShell>
  );
}
```

#### Step 11: Add to Sidebar
**File:** `components/dashboard/nav-items.ts`

```typescript
export const NAV_ITEMS = [
  // ... existing items ...
  { href: "/dashboard/faq", label: "FAQ", icon: "HelpCircle" },
];
```

#### Step 12: Update Template Config
**File:** `templates/configs/template1.ts`

```typescript
export const Aurora = {
  name: "Aurora",
  home: {
    header: "header_v1",
    hero: "hero_v1",
    about: "about_v1",
    services: "services_v1",
    gallery: "gallery_v1",
    faq: "faq_v1",  // ← Add this
    contact: "contact_v1",
  },
};
```

#### Step 13: Test
1. Go to `/dashboard/faq`
2. Edit FAQ title and items
3. See in preview
4. Refresh - persists

**✅ New section complete!**

---

## Task 4: Export/Download Website Data

### Goal: Let users download their website data as JSON

### File: Create `lib/export.ts`

```typescript
import { SiteContent } from "@/types/content";

export function exportSiteData(content: SiteContent, siteTitle: string) {
  const dataStr = JSON.stringify(content, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${siteTitle}-data-${new Date().toISOString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

### Usage in Component:

```typescript
import { exportSiteData } from "@/lib/export";

export function PublishButton() {
  const content = useSiteContent();
  const settings = useAppSelector((state) => state.settings);

  const handleExport = () => {
    if (content) {
      exportSiteData(content, settings.title);
    }
  };

  return <button onClick={handleExport}>Download Data</button>;
}
```

---

## Task 5: Add Image Upload Handler

### Goal: Let users upload images instead of just pasting URLs

### File: Create `lib/upload.ts`

```typescript
export async function uploadImage(file: File): Promise<string> {
  // Option 1: Convert to Base64 (for localStorage)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Option 2: Upload to server/cloud storage
  // const formData = new FormData();
  // formData.append("file", file);
  // const res = await fetch("/api/upload", { method: "POST", body: formData });
  // return res.json().url;
}

export function validateImageFile(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
}
```

### Usage in Editor:

```typescript
export function HeaderEditor() {
  // ... existing code ...

  const handleLogoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) {
      alert("Invalid file. Use JPG, PNG, WebP, or GIF (max 5MB)");
      return;
    }

    try {
      const dataUrl = await uploadImage(file);
      setValue("logoImage", dataUrl);  // Set the data URL
    } catch (error) {
      alert("Upload failed");
    }
  };

  return (
    <form>
      {/* ... existing fields ... */}
      
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoImageUpload}
        className="block w-full"
      />
    </form>
  );
}
```

---

## Task 6: Add Template Switching Logic

### Goal: Let users switch templates and keep their data

```typescript
// In store/slices/templateSlice.ts
export const templateSlice = createSlice({
  name: "template",
  initialState: {
    id: "aurora",
  },
  reducers: {
    setTemplate: (state, action) => {
      state.id = action.payload;
      // ✅ Content data is NOT changed
      // Only the template variant changes
      // Same data, different appearance!
    },
  },
});
```

### Usage:

```typescript
export function TemplateGallery() {
  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-cols-5 gap-4">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => dispatch(setTemplate(template.id))}
          className="border-2 rounded-lg p-4 hover:border-blue-500"
        >
          <img src={template.preview} alt={template.name} />
          <p>{template.name}</p>
        </button>
      ))}
    </div>
  );
}
```

---

## Quick Patterns Reference

### Pattern 1: Add a Form Field
```
types/content.ts → Add field to interface
↓
lib/schemas.ts → Add validation
↓
data/default-content.ts → Add default value
↓
components/editors/XEditor.tsx → Add <Input> or <Textarea>
↓
templates/sections/X/XV1.tsx → Use the field
```

### Pattern 2: Add a Component Variant
```
Create component file
↓
Add import to sectionRegistry.ts
↓
Add to registry object
↓
Update template config to use new variant
```

### Pattern 3: Add a New Section
```
types/content.ts → Add interface
↓
types/template.ts → Add type & update RENDER_ORDER
↓
lib/schemas.ts → Add schema
↓
store/slices/websiteSlice.ts → Add reducer
↓
data/default-content.ts → Add default
↓
Create components (V1-V5)
↓
sectionRegistry.ts → Add all variants
↓
Create editor component
↓
Create route app/dashboard/[section]/page.tsx
↓
Update template configs
```

---

**You're ready to extend this project! 🚀**

Pick a task and follow the step-by-step guide. The patterns are consistent across all sections and variants.
