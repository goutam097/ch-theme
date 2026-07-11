# 📊 Quick Reference Guide

## Project at a Glance

**What is this?** A Next.js website builder where users can:
- Pick from 5 templates (Aurora, Meridian, Noir, Pulse, Bloom)
- Edit 6 sections (Header, Hero, About, Services, Gallery, Contact)
- See live preview
- Publish their website

---

## The 3-Layer Architecture

```
┌─────────────────┐
│   UI LAYER      │  Users interact here
│ Editors & Forms │  (Dashboard, Editor Components)
└────────┬────────┘
         │
         ▼ dispatch action
┌─────────────────┐
│  STATE LAYER    │  Data lives here
│  Redux Store    │  (websiteSlice, templateSlice)
└────────┬────────┘
         │
         ▼ pass data props
┌─────────────────┐
│ DISPLAY LAYER   │  Components render here
│  React Comps    │  (HeaderV1-V5, etc.)
└─────────────────┘
```

---

## File Dependency Chain (Read in This Order)

```
1. types/content.ts
   └─ Defines what data looks like
   
2. types/template.ts
   └─ Defines template structure
   
3. types/section-props.ts
   └─ Defines component props
   
4. store/slices/websiteSlice.ts
   └─ How to update state
   
5. store/index.ts
   └─ How state is stored/loaded
   
6. templates/sections/header/HeaderV1.tsx
   └─ Example component (receives data)
   
7. templates/registry/sectionRegistry.ts
   └─ Maps variant strings to components
   
8. templates/registry/TemplateRenderer.tsx
   └─ Magic that ties it all together
   
9. templates/configs/template1.ts
   └─ Which component for which section
   
10. components/editors/HeaderEditor.tsx
    └─ How users modify data
```

---

## Redux Flow Diagram

```
User Types in Form
        ↓
React Hook Form detects change
        ↓
dispatch(updateHeader({ logoText: "New" }))
        ↓
Redux Action → websiteSlice Reducer
        ↓
state.header = { ...state.header, ...payload }
        ↓
localStorage updated automatically
        ↓
All components subscribed to useSiteContent() re-render
        ↓
Preview shows new data
```

---

## Component Connection Map

```
HeaderEditor
  ↓ watch → dispatch
Redux (websiteSlice)
  ↓ useSiteContent
TemplateRenderer
  ↓ sectionData
HeaderV1 / HeaderV2 / etc
  ↓ renders
HTML page
```

---

## File Location Reference

| What | Where |
|------|-------|
| **Data types** | `types/content.ts` |
| **Component types** | `types/section-props.ts` |
| **Template config types** | `types/template.ts` |
| **State management** | `store/slices/websiteSlice.ts` |
| **Redux setup** | `store/index.ts` |
| **Custom hooks** | `hooks/useSite.ts` |
| **Header components** | `templates/sections/header/` |
| **Component lookup** | `templates/registry/sectionRegistry.ts` |
| **Dynamic rendering** | `templates/registry/TemplateRenderer.tsx` |
| **Template recipes** | `templates/configs/template[1-5].ts` |
| **Form validation** | `lib/schemas.ts` |
| **Editor forms** | `components/editors/` |
| **Dashboard routes** | `app/dashboard/[section]/page.tsx` |
| **Published site** | `app/site/[slug]/page.tsx` |

---

## Key Data Structures

### HeaderData (from types/content.ts)
```typescript
{
  logoText?: string;        // "MyWebsite"
  logoImage?: string;       // "https://..."
  menuItems?: string[];     // ["Home", "About", "Services"]
}
```

### SiteContent (from types/content.ts)
```typescript
{
  header: HeaderData;
  hero: HeroData;
  about: AboutData;
  services: ServicesData;
  gallery: GalleryData;
  contact: ContactData;
}
```

### Template Config (from templates/configs/template1.ts)
```typescript
{
  name: "Aurora";
  home: {
    header: "header_v1";     // Component variant
    hero: "hero_v1";
    about: "about_v1";
    services: "services_v1";
    gallery: "gallery_v1";
    contact: "contact_v1";
  }
}
```

---

## Redux Slices & Actions

### websiteSlice
```
updateHeader(payload)       → Updates state.website.header
updateHero(payload)         → Updates state.website.hero
updateAbout(payload)        → Updates state.website.about
updateServices(payload)     → Updates state.website.services
updateGallery(payload)      → Updates state.website.gallery
updateContact(payload)      → Updates state.website.contact
```

### templateSlice
```
setTemplate(templateName)   → Changes which template is active
setVariant(section, variant)→ Changes component variant
```

### settingsSlice
```
updateSettings(payload)     → Stores website name, slug, etc
```

---

## Route Map

| Route | Purpose | Component |
|-------|---------|-----------|
| `/dashboard/header` | Edit header | HeaderEditor in EditorShell |
| `/dashboard/hero` | Edit hero | HeroEditor in EditorShell |
| `/dashboard/about` | Edit about | AboutEditor in EditorShell |
| `/dashboard/services` | Edit services | ServicesEditor in EditorShell |
| `/dashboard/gallery` | Edit gallery | GalleryEditor in EditorShell |
| `/dashboard/contact` | Edit contact | ContactEditor in EditorShell |
| `/dashboard/templates` | Pick template | TemplateGallery |
| `/dashboard/settings` | Settings | SettingsEditor |
| `/dashboard/preview` | Live preview | PreviewCanvas |
| `/preview` | Full preview page | TemplateRenderer |
| `/site/[slug]` | Published website | TemplateRenderer |

---

## How to Find Things

### "Where do I edit header?"
1. User goes to `/dashboard/header`
2. Loads `app/dashboard/header/page.tsx`
3. Renders `HeaderEditor` component
4. User edits form
5. Dispatches `updateHeader` action
6. Redux state updates
7. `TemplateRenderer` rerenders with new data

### "Where is header data?"
1. Check `store/slices/websiteSlice.ts` → `state.website.header`
2. Access via `useSiteContent()` hook
3. Stays in sync with localStorage via `store/index.ts`

### "Where does HeaderV1 get its data?"
1. `TemplateRenderer` looks up variant: "header_v1"
2. Finds component in `templates/registry/sectionRegistry.ts`
3. Gets data: `content.header` from Redux
4. Passes as props: `<HeaderV1 data={content.header} />`
5. Component uses data to render

### "How are 5 templates different?"
1. Each has a config in `templates/configs/template[1-5].ts`
2. Each config maps sections to different variants
3. Aurora: header_v1, hero_v1, about_v1, ...
4. Meridian: header_v2, hero_v2, about_v2, ...
5. Components themselves are different (different styling)

---

## Debugging Checklist

- [ ] Data in Redux store? (Check React DevTools)
- [ ] Component received data props? (Add console.log)
- [ ] Form dispatched action? (Check Redux DevTools actions)
- [ ] localStorage updated? (Check DevTools → Application)
- [ ] Component syntax correct? (Check console for errors)
- [ ] Variant string matches registry? (Check sectionRegistry.ts)
- [ ] Template config has section? (Check template config)

---

## Common Patterns

### Pattern 1: Add a form field
```typescript
// 1. Update types/content.ts
interface HeaderData {
  logoText?: string;
  newField?: string;  // Add here
}

// 2. Update store/slices/websiteSlice.ts
updateHeader: (state, action) => {
  state.header = { ...state.header, ...action.payload };
}
// (already handles all fields!)

// 3. Add to components/editors/HeaderEditor.tsx
<Input {...register("newField")} />

// 4. Add to lib/schemas.ts
headerSchema = z.object({
  logoText: ...,
  newField: z.string().optional(),  // Add validation
})
```

### Pattern 2: Create new component variant
```typescript
// 1. Create templates/sections/header/HeaderV6.tsx
export function HeaderV6({ data, theme }: HeaderSectionProps) {
  return <header>...</header>;
}

// 2. Add to templates/registry/sectionRegistry.ts
header_v6: HeaderV6,

// 3. Use in templates/configs/template1.ts
home: {
  header: "header_v6",  // Change this
}

// 4. That's it! TemplateRenderer handles the rest
```

---

## State Flow Visualization

```
User Action (type in form)
    ↓
Watch detects change
    ↓
Dispatch action to Redux
    ↓
Reducer updates state
    ↓
localStorage saves
    ↓
useSiteContent() subscribers notified
    ↓
Components re-render
    ↓
UI updates
```

---

## The 5 Component Families

```
HeaderV1 - Clean white header
HeaderV2 - Gradient blue-purple
HeaderV3 - Dark gray-900
HeaderV4 - Modern with animated underline
HeaderV5 - Premium centered

(Same structure for Hero, About, Services, Gallery, Contact)
```

Each family has 5 visual variants, all using the same data structure.

---

**✨ You now understand the entire project architecture!**

Next steps:
1. Pick one section (e.g., Header)
2. Trace the data from Redux → Component → UI
3. Follow the patterns to extend or modify
4. Remember: Types → Redux → Components → UI
