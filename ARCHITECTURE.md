# SiteForge — Website Builder Platform

A **template-based** website builder (explicitly **not** a drag-and-drop editor).
Users can only:

1. **Select** a template
2. **Fill** content
3. **Preview** the website
4. **Publish** the website

They **cannot** add, remove, reorder, or re-style sections, and they never choose
section variants — a template fully determines the structure and look.

> Stack: **Next.js 16 (App Router)** · **TypeScript** · **Tailwind v4** ·
> **Redux Toolkit** · **React Hook Form** · **Zod** · **shadcn-style UI** ·
> **Framer Motion**.

---

## 1. The core idea

The whole platform rests on one decision:

> **Every template and every section variant consumes the _same_ data model.**

A template is **pure data** — a mapping of `section → variant id` plus a theme.
Switching a template changes *which components render*, never *the content*. That
makes template switching lossless and makes scaling to 100+ templates a matter of
adding config + variant files, with **zero duplicated page structures**.

```
            ┌─────────────────────────────────────────────┐
            │            MASTER DATA MODEL                  │
            │  hero · about · services · gallery · contact  │
            │           (Redux: websiteSlice)               │
            └───────────────┬───────────────────────────────┘
                            │ same shape for everyone
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
  TemplateConfig      TemplateConfig      TemplateConfig
  home: {hero_v1…}    home: {hero_v2…}    home: {hero_v5…}
        │                   │                   │
        └─────────► sectionRegistry[variantId] ◄┘
                            │
                            ▼
                   TemplateRenderer  ──►  <ThemeScope> + sections
                            │
        ┌───────────────────┼─────────────────────┐
        ▼                   ▼                     ▼
   Live preview      /preview (full)        /site/[slug] (public)
```

---

## 2. Folder structure

```
app/                         # Next.js App Router (routing only)
  layout.tsx                 # root layout → wraps app in <StoreProvider>
  page.tsx                   # marketing landing → links to /dashboard
  dashboard/
    layout.tsx               # sidebar + header shell
    page.tsx                 # overview + completeness checklist
    templates/page.tsx       # template gallery (selection / switching)
    home/page.tsx            # Hero editor  (split live preview)
    about/page.tsx           # About editor
    services/page.tsx        # Services editor
    gallery/page.tsx         # Gallery editor
    contact/page.tsx         # Contact editor
    preview/page.tsx         # full preview + device toggle
    settings/page.tsx        # site identity + SEO
  preview/page.tsx           # standalone full-bleed preview (new tab)
  site/[slug]/page.tsx       # published public website

types/                       # master data model + template/prop types
lib/                         # utils (cn, slugify), zod schemas, theme→CSS vars
data/                        # default seed content
store/                       # Redux Toolkit
  slices/                    # websiteSlice, templateSlice, mediaSlice, settingsSlice
  index.ts                   # configureStore + localStorage persistence
  hooks.ts                   # typed useAppSelector / useAppDispatch
  StoreProvider.tsx          # client provider boundary
hooks/                       # useSiteContent / useActiveTemplate / useSettings
components/
  ui/                        # shadcn-style primitives (button, input, …)
  dashboard/                 # sidebar, header, publish, template gallery, editor shell
  editors/                   # one RHF+Zod form per section + settings
  preview/                   # PreviewCanvas, PreviewToolbar
templates/
  configs/                   # template1…N (declarative; one object each)
  registry/                  # templateRegistry, sectionRegistry, TemplateRenderer
  sections/                  # hero/ about/ services/ gallery/ contact/  (V1…Vn)
  theme/                     # ThemeScope (applies template tokens as CSS vars)
```

> **No `src/`** — this project keeps `app/` at the repo root (matching the existing
> setup), and the `@/*` path alias points at the root, so imports read `@/store`,
> `@/templates/...`, etc.

**Why this beats per-template page folders:** the anti-pattern duplicates
`Home/About/Services` for every template (20× the files, 20× the maintenance).
Here there is exactly **one** of each section *kind*, with N visual *variants*,
and templates are thin configs that reference them.

---

## 3. Master data model (`types/content.ts`)

```ts
HeroData     { title, subtitle, description, image?, video?, carousel?, buttonText?, buttonLink? }
AboutData    { title, description, image? }
ServiceItem  { title, description, image? }          // services: ServiceItem[]
GalleryItem  { image }                               // gallery: GalleryItem[]
ContactData  { phone, email, address, mapUrl? }
SiteContent  { hero, about, services[], gallery[], contact }
```

Every variant receives the **same** typed slice (`SectionComponentProps<T>` =
`{ data, theme }`) and decides which fields to render:

| Variant   | Renders                                  |
| --------- | ---------------------------------------- |
| `hero_v1` | title, subtitle, description, image, btn |
| `hero_v2` | split image panel                        |
| `hero_v3` | text-only (ignores image/video)          |
| `hero_v4` | **video** background (falls back image)  |
| `hero_v5` | **carousel** of images                   |

---

## 4. Template configuration system (`templates/configs/`)

A template declares only *intent*:

```ts
export const template1: TemplateConfig = {
  id: "template1",
  name: "Aurora",
  category: "SaaS",
  thumbnail: "…",
  home: { hero: "hero_v1", about: "about_v1", services: "services_v1",
          gallery: "gallery_v1", contact: "contact_v1" },
  theme: { primary, secondary, accent, background, foreground, muted,
           radius, fontHeading, fontBody },
};
```

## 5. Template registry (`registry/templateRegistry.ts`)

```ts
export const templates = { template1, template2, template3, template4, template5 };
```

Add `template6` → import it + add one key. Dashboard, gallery, and renderer update
automatically (they iterate `templateList`).

## 6. Section registry (`registry/sectionRegistry.ts`)

```ts
export const sectionRegistry = {
  hero_v1: HeroV1, … hero_v5: HeroV5,
  about_v1: AboutV1, …,
  services_v1: ServicesV1, …,
  gallery_v1: GalleryV1, …,
  contact_v1: ContactV1, …,
};
```

A string id is resolved to a component at render time, so configs stay
serializable and the rendering engine stays generic.

---

## 7. Redux architecture (`store/`)

| Slice           | State                                                | Responsibility                          |
| --------------- | ---------------------------------------------------- | --------------------------------------- |
| `websiteSlice`  | `SiteContent`                                        | the template-agnostic content           |
| `templateSlice` | `{ activeTemplateId }`                               | which template is selected              |
| `mediaSlice`    | `{ assets: MediaAsset[] }`                           | media library                           |
| `settingsSlice` | `SiteSettings + previewDevice`                       | identity, SEO, publish state, preview UI |

- **Typed hooks** (`useAppSelector` / `useAppDispatch`) via `withTypes`.
- **Persistence**: a `store.subscribe` writes to `localStorage` (coalesced with
  `queueMicrotask`); transient `previewDevice` is excluded. State rehydrates on
  load, so the standalone `/preview` and `/site/[slug]` tabs see the same data.
- **Provider**: `StoreProvider` is a `"use client"` boundary that creates the
  store once per client (per Redux's App Router guidance).

---

## 8. Dynamic rendering engine (`registry/TemplateRenderer.tsx`)

```tsx
const template = getTemplate(templateId);
return (
  <ThemeScope theme={template.theme}>
    {RENDER_ORDER.map((section) => {
      const Section = getSectionComponent(template.home[section]);
      return <Section key={section} data={content[section]} theme={template.theme} />;
    })}
  </ThemeScope>
);
```

One function powers **all three** rendering surfaces (live preview, `/preview`,
`/site/[slug]`) so output is guaranteed identical. `RENDER_ORDER` is fixed —
users cannot reorder sections.

---

## 9. Dashboard architecture

A single shared dashboard, variant-agnostic by design — the user never learns
which variant is active.

- `dashboard/layout.tsx`: fixed `Sidebar` + `DashboardHeader` (status + Publish),
  scrollable `<main>`.
- Content pages reuse **`EditorShell`** → split layout: **form left, live preview
  right**, with a device toolbar.
- Each editor is a **React Hook Form + Zod** form (`zodResolver`). A `watch()`
  subscription dispatches changes to Redux on every keystroke → instant preview.
- Services & Gallery use `useFieldArray` for add/remove of *content items*
  (still content, not structure).

## 10. Live preview architecture

`PreviewCanvas` reads `websiteSlice` + `templateSlice` directly and renders
`TemplateRenderer`. It is wrapped in a device-width frame
(`desktop` / `tablet 768px` / `mobile 390px`) driven by `settings.previewDevice`.
Because it subscribes to the store, edits reflect with no save step. A `key={template.id}`
forces a clean remount on template switch so entrance animations replay.

## 11. Theme system

Each template carries a `theme` preset. `themeToCssVars()` projects it onto scoped
CSS custom properties (`--site-primary`, `--site-foreground`, `--site-radius`,
`--site-font-heading`, …). `<ThemeScope>` sets those variables on a wrapper, and
every section reads them through Tailwind arbitrary values, e.g.
`bg-[var(--site-primary)]`, `text-[color:var(--site-foreground)]`,
`rounded-[var(--site-radius)]`. No recompilation, no per-template CSS files; the
dashboard chrome is unaffected because the variables are scoped to the site output.

## 12. Component hierarchy

```
RootLayout (StoreProvider)
├─ / ............................ marketing landing
├─ /dashboard (DashboardLayout = Sidebar + Header)
│   ├─ overview / templates / settings
│   └─ home|about|services|gallery|contact
│        └─ EditorShell
│            ├─ <SectionEditor/>  (RHF + Zod → dispatch)
│            └─ PreviewToolbar + PreviewCanvas
│                 └─ TemplateRenderer → ThemeScope → [Hero|About|…]Vn
├─ /preview .................... TemplateRenderer (full-bleed)
└─ /site/[slug] ............... TemplateRenderer (published)
```

---

## 13. Scaling to 100+ templates

The architecture is intentionally **O(1) per addition**:

1. **Add a variant** — drop `HeroV6.tsx` in `sections/hero/`, add one line to
   `sectionRegistry`. It automatically receives the correct typed `data`.
2. **Add a template** — create `configs/template6.ts` (a single object), add one
   line to `templateRegistry`. The gallery, switcher, and renderer pick it up with
   no further changes.
3. **No new pages, ever.** Routing is fixed; only data/components grow.

Recommended practices as the catalog grows:

- **Lazy-load variants** with `next/dynamic` in the section registry so each
  template ships only the ~5 variant chunks it uses (keeps the public site lean).
- **Generate `theme` presets** from a tokens file; consider a small JSON schema +
  build-time validation so configs can't reference a missing variant id.
- **Validate registries in CI**: assert every `home.*` variant id exists in
  `sectionRegistry` and every config id is unique.
- **Move publish to a backend**: persist a `{ templateId, content, settings }`
  snapshot per slug; make `/site/[slug]` a Server Component that fetches it and
  exports `generateMetadata` for SEO. The render call is unchanged.
- **Group variants by family/tags** to power filtering in the template gallery.

---

## Scope note for this implementation

The platform, data model, registries, Redux store, dynamic renderer, dashboard,
live preview, theme system, and publish flow are **complete and production-shaped**.
**5 fully distinct template families (25 section variants, V1–V5)** are
implemented end-to-end as the reference set. Reaching the full 20 templates /
100 variants is the **mechanical** process described in §13 — add config + variant
files and one registry line each; no architectural change is required.

## Running

```bash
npm install
npm run dev     # http://localhost:3000  → "Open the dashboard"
npm run build
```

Images use plain `<img>` (not `next/image`) on purpose: users paste arbitrary
remote image URLs, which would otherwise require wildcard `remotePatterns`.
