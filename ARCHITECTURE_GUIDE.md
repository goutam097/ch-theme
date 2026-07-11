# 🚀 Project Architecture & Code Understanding Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Data Flow (How Everything Connects)](#data-flow)
4. [Step-by-Step Learning Path](#step-by-step-learning-path)
5. [Key Folders & Their Purpose](#key-folders--their-purpose)
6. [Important Files & Their Roles](#important-files--their-roles)
7. [How Everything Works Together](#how-everything-works-together)
8. [Common Workflows](#common-workflows)

---

## Project Overview

This is a **Next.js-based Website Builder** that lets users:
- Choose from 5 pre-designed website templates (Aurora, Meridian, Noir, Pulse, Bloom)
- Edit different sections: **Header**, Hero, About, Services, Gallery, Contact
- See live preview as they edit
- Publish their website

### Tech Stack
- **Framework**: Next.js 14+ (React 18+)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod (validation)
- **Storage**: localStorage (persisted state)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │    Preview   │  │  Published   │      │
│  │   (Editors)  │  │   (Live)     │  │   Site       │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    REDUX STATE STORE                         │
│                                                              │
│  websiteSlice {                                             │
│    header: { logoText, logoImage, menuItems }              │
│    hero: { title, subtitle, backgroundImage }              │
│    about: { heading, description, image }                  │
│    services: { items: [] }                                 │
│    gallery: { items: [] }                                  │
│    contact: { email, phone, address }                      │
│  }                                                          │
│                                                              │
│  templateSlice {                                            │
│    currentTemplate: "aurora" (or meridian, noir, etc)      │
│    sectionVariants: { header: "header_v1", ... }           │
│  }                                                          │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│              TEMPLATE RENDERER ENGINE                        │
│                                                              │
│  1. Get template config (e.g., "aurora")                   │
│  2. Get site content from Redux                            │
│  3. For each section (header, hero, about...)              │
│     - Look up variant (e.g., "header_v1")                  │
│     - Find component in registry                           │
│     - Pass data props                                      │
│  4. Render complete page                                   │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│          SECTION COMPONENTS (Header, Hero, etc)             │
│                                                              │
│  HeaderV1, HeaderV2, HeaderV3, HeaderV4, HeaderV5         │
│  HeroV1, HeroV2, HeroV3, HeroV4, HeroV5                    │
│  ... (and so on for each section)                          │
│                                                              │
│  Each receives:                                            │
│  - data (from Redux)                                       │
│  - theme (from Redux or defaults)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### When User Edits Logo Text in Header Editor:

```
1. User types in HeaderEditor form
   ↓
2. React Hook Form detects change
   ↓
3. handleMenuItemsChange() processes input
   ↓
4. setValue() updates form state
   ↓
5. watch() triggers effect
   ↓
6. dispatch(updateHeader(values)) → Redux
   ↓
7. websiteSlice reducer updates state.website.header
   ↓
8. localStorage saves new state
   ↓
9. useSiteContent() hook notifies all subscribers
   ↓
10. Preview component rerenders with new data
    ↓
11. Header components receive new data props
    ↓
12. UI updates instantly (live preview)
```

### When User Views Published Site at `/site/[slug]`:

```
1. Next.js loads [slug]/page.tsx
   ↓
2. Fetches template config from templateRegistry
   ↓
3. Reads SiteContent from Redux store
   ↓
4. TemplateRenderer maps content → components
   ↓
5. Each section (Header, Hero, etc.) renders with its data
   ↓
6. Complete HTML page served to browser
```

---

## Step-by-Step Learning Path

### Week 1: Understand the Basics

#### Day 1: Start with Types (The Blueprint)
**Why first?** Types define what data looks like throughout the app.

1. **Read `types/content.ts`**
   - Defines `HeaderData`, `HeroData`, `SiteContent` interfaces
   - This is the "shape" of your data
   - Everything follows these types

2. **Read `types/template.ts`**
   - Defines `TemplateConfig`, `SectionVariantMap`
   - Explains how templates map sections to components

3. **Read `types/section-props.ts`**
   - Defines `SectionComponentProps` (what each component receives)

```typescript
// EXAMPLE: When you see this in a component:
export function HeaderV1({ data }: HeaderSectionProps) {
  // data is typed as HeaderData (from types/content.ts)
  // This comes from types/section-props.ts
}
```

---

#### Day 2: Redux State Management
**Why?** Redux is the single source of truth for all data.

1. **Read `store/slices/websiteSlice.ts`**
   - `updateHeader()` reducer
   - `updateHero()` reducer
   - And so on...
   - These are the ONLY ways to modify state

2. **Read `store/index.ts`**
   - How store is configured
   - How localStorage persistence works
   - State migration logic

3. **Read `store/hooks.ts`**
   - `useSiteContent()` - gets current website content
   - `useAppDispatch()` - sends actions to Redux

```typescript
// EXAMPLE: How Redux is used
const content = useSiteContent();  // Get current state
dispatch(updateHeader({ logoText: "New Logo" }));  // Update state
```

---

#### Day 3: Components & Sections
**Why?** This is where the UI lives.

1. **Look at one Header component** (e.g., `HeaderV1.tsx`)
   ```typescript
   // Pattern:
   export function HeaderV1({ data, theme }: HeaderSectionProps) {
     // 1. Get data from props
     // 2. Provide defaults if data missing
     const menuItems = data?.menuItems || ["Home", "About", ...];
     
     // 3. Render JSX
     return <header>...</header>;
   }
   ```

2. **All 5 header variants** follow the same pattern
   - Different styling (colors, layout)
   - Same data requirements
   - Same component signature

---

#### Day 4: The Registry System
**Why?** Dynamic component resolution - the app picks the right component at runtime.

1. **Read `templates/registry/sectionRegistry.ts`**
   ```typescript
   // Maps variant strings to components
   export const sectionRegistry = {
     header_v1: HeaderV1,
     header_v2: HeaderV2,
     // ...
   };
   ```

2. **Read `templates/registry/TemplateRenderer.tsx`**
   ```typescript
   // How it works:
   const component = sectionRegistry[variantId]; // Get component
   return React.createElement(component, { data, theme }); // Render it
   ```

---

#### Day 5: Template Configs
**Why?** Defines which variant each template uses for each section.

1. **Read `templates/configs/template1.ts`**
   ```typescript
   export const Aurora = {
     home: {
       header: "header_v1",  // Uses HeaderV1
       hero: "hero_v1",      // Uses HeroV1
       about: "about_v1",
       // ...
     }
   };
   ```

2. **Each template is similar** - just different section variants

---

### Week 2: Put It All Together

#### Day 6: Editors & Dashboards
**Why?** This is how users modify data.

1. **Read `components/editors/HeaderEditor.tsx`**
   ```typescript
   // Pattern:
   // 1. Get current data
   const content = useSiteContent();
   
   // 2. Create form with react-hook-form
   const { register, watch, setValue } = useForm();
   
   // 3. Watch changes
   useEffect(() => {
     watch((values) => {
       // 4. Push to Redux
       dispatch(updateHeader(values));
     });
   });
   
   // 5. Render form inputs
   return <form>...</form>;
   ```

2. **Same pattern for all editors** (HeroEditor, AboutEditor, etc.)

---

#### Day 7: Route Structure
**Why?** Understanding how URLs map to functionality.

```
/dashboard
  ├─ /dashboard/header       → HeaderEditor component
  ├─ /dashboard/hero         → HeroEditor component
  ├─ /dashboard/about        → AboutEditor component
  ├─ /dashboard/services     → ServicesEditor component
  ├─ /dashboard/gallery      → GalleryEditor component
  ├─ /dashboard/contact      → ContactEditor component
  ├─ /dashboard/templates    → TemplateGallery (choose template)
  ├─ /dashboard/settings     → SettingsEditor
  └─ /dashboard/preview      → PreviewCanvas (live preview)

/preview                       → Full preview page

/site/[slug]                   → Published website
  └─ [slug] = website identifier from settings
```

---

## Key Folders & Their Purpose

```
d:\Shanviatech Projects\templates\
├── app/                          # Next.js routes
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── dashboard/                # Dashboard routes
│   │   ├── layout.tsx
│   │   ├── header/page.tsx       # Header editor
│   │   ├── hero/page.tsx         # Hero editor
│   │   ├── about/page.tsx        # About editor
│   │   ├── services/page.tsx     # Services editor
│   │   ├── gallery/page.tsx      # Gallery editor
│   │   ├── contact/page.tsx      # Contact editor
│   │   ├── templates/page.tsx    # Template chooser
│   │   ├── settings/page.tsx     # Settings editor
│   │   ├── preview/page.tsx      # Preview page
│   │   └── home/page.tsx         # Dashboard home
│   ├── preview/page.tsx          # Full preview page
│   └── site/[slug]/page.tsx      # Published website
│
├── types/                        # TypeScript interfaces (BLUEPRINT)
│   ├── content.ts                # Data shapes (HeaderData, HeroData, etc)
│   ├── template.ts               # Template config shapes
│   ├── section-props.ts          # Component prop shapes
│   └── settings.ts               # Settings data shape
│
├── store/                        # Redux state management (SINGLE SOURCE OF TRUTH)
│   ├── index.ts                  # Store config + persistence
│   ├── hooks.ts                  # useAppDispatch, useSiteContent
│   ├── StoreProvider.tsx         # Redux Provider wrapper
│   └── slices/
│       ├── websiteSlice.ts       # Header, Hero, About, etc updates
│       ├── templateSlice.ts      # Template selection
│       ├── settingsSlice.ts      # Settings updates
│       └── mediaSlice.ts         # Media/images state
│
├── components/                   # React components
│   ├── dashboard/
│   │   ├── Sidebar.tsx           # Dashboard sidebar nav
│   │   ├── DashboardHeader.tsx   # Dashboard top bar
│   │   ├── EditorShell.tsx       # Editor layout wrapper
│   │   ├── TemplateGallery.tsx   # Template picker
│   │   └── PublishButton.tsx     # Publish functionality
│   ├── editors/                  # Section editors
│   │   ├── HeaderEditor.tsx      # Edit header
│   │   ├── HeroEditor.tsx        # Edit hero
│   │   ├── AboutEditor.tsx       # Edit about
│   │   ├── ServicesEditor.tsx    # Edit services
│   │   ├── GalleryEditor.tsx     # Edit gallery
│   │   ├── ContactEditor.tsx     # Edit contact
│   │   └── SettingsEditor.tsx    # Edit website settings
│   ├── preview/
│   │   ├── PreviewCanvas.tsx     # Live preview container
│   │   └── PreviewToolbar.tsx    # Preview controls
│   └── ui/                       # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── card.tsx
│       ├── field.tsx
│       └── label.tsx
│
├── templates/                    # Section components & configs
│   ├── configs/                  # Template definitions
│   │   ├── template1.ts          # Aurora template config
│   │   ├── template2.ts          # Meridian template config
│   │   ├── template3.ts          # Noir template config
│   │   ├── template4.ts          # Pulse template config
│   │   ├── template5.ts          # Bloom template config
│   │   └── index.ts              # All configs exported
│   ├── registry/
│   │   ├── sectionRegistry.ts    # Maps variants to components
│   │   ├── templateRegistry.ts   # Maps template names to configs
│   │   ├── TemplateRenderer.tsx  # Dynamic component renderer
│   │   └── section-data.ts       # Default section data
│   └── sections/                 # Actual visual components
│       ├── header/
│       │   ├── HeaderV1.tsx      # Clean white header
│       │   ├── HeaderV2.tsx      # Gradient header
│       │   ├── HeaderV3.tsx      # Dark header
│       │   ├── HeaderV4.tsx      # Modern header
│       │   └── HeaderV5.tsx      # Premium header
│       ├── hero/                 # Hero section variants
│       ├── about/                # About section variants
│       ├── services/             # Services section variants
│       ├── gallery/              # Gallery section variants
│       └── contact/              # Contact section variants
│
├── lib/                          # Utilities & validation
│   ├── schemas.ts                # Zod validation schemas
│   ├── theme.ts                  # Theme utilities
│   └── utils.ts                  # Helper functions
│
├── hooks/                        # Custom React hooks
│   └── useSite.ts                # useSiteContent hook
│
├── data/                         # Static data
│   └── default-content.ts        # Default website content
│
└── public/                       # Static assets
```

---

## Important Files & Their Roles

### 1. **types/content.ts** (THE BLUEPRINT)
```typescript
// Defines what HeaderData looks like
interface HeaderData {
  logoText?: string;
  logoImage?: string;
  menuItems?: string[];
}

// Defines complete website structure
interface SiteContent {
  header: HeaderData;
  hero: HeroData;
  about: AboutData;
  services: ServicesData;
  gallery: GalleryData;
  contact: ContactData;
}
```
**When used:** Every component that handles header data uses this type.

---

### 2. **store/slices/websiteSlice.ts** (THE KEEPER OF STATE)
```typescript
// The only way to change state
updateHeader: (state, action) => {
  state.header = { ...state.header, ...action.payload };
}

// All editors dispatch this action
dispatch(updateHeader({ logoText: "New Logo" }));
```
**When used:** Every editor dispatches to this when form changes.

---

### 3. **templates/registry/TemplateRenderer.tsx** (THE MAGIC)
```typescript
// Renders dynamic page based on template config
function TemplateRenderer({ templateId }: Props) {
  const template = getTemplate(templateId);  // Get config
  const content = useSiteContent();           // Get data
  
  return (
    <>
      {RENDER_ORDER.map((section) => {
        const variant = template.home[section];
        const Component = getSectionComponent(variant);
        const data = content[section];
        return <Component key={section} data={data} />;
      })}
    </>
  );
}
```
**When used:** Every page that needs to display a template uses this.

---

### 4. **components/editors/HeaderEditor.tsx** (THE INPUT)
```typescript
// User edits header here
function HeaderEditor() {
  const content = useSiteContent();
  const { register, watch } = useForm();
  
  useEffect(() => {
    watch((values) => {
      dispatch(updateHeader(values));  // Push changes to Redux
    });
  });
  
  return <form>...</form>;
}
```
**When used:** `/dashboard/header` route uses this.

---

### 5. **store/index.ts** (THE STORAGE)
```typescript
// Reads from localStorage on app load
function loadPersistedState() {
  const saved = localStorage.getItem("appState");
  return JSON.parse(saved) || getDefaultState();
}

// Saves to localStorage whenever state changes
store.subscribe(() => {
  localStorage.setItem("appState", JSON.stringify(store.getState()));
});
```
**When used:** App startup and every state change.

---

### 6. **templates/configs/template1.ts** (THE TEMPLATE RECIPE)
```typescript
export const Aurora = {
  name: "Aurora",
  home: {
    header: "header_v1",    // Use this component
    hero: "hero_v1",
    about: "about_v1",
    services: "services_v1",
    gallery: "gallery_v1",
    contact: "contact_v1",
  },
};
```
**When used:** TemplateRenderer looks this up to know which components to render.

---

### 7. **templates/sections/header/HeaderV1.tsx** (THE VISUAL)
```typescript
export function HeaderV1({ data, theme }: HeaderSectionProps) {
  const logoText = data?.logoText || "MyWebsite";
  const menuItems = data?.menuItems || ["Home", "About"];
  
  return (
    <header className="flex items-center justify-between">
      <div>{logoText}</div>
      <nav>
        {menuItems.map((item) => (
          <a key={item}>{item}</a>
        ))}
      </nav>
    </header>
  );
}
```
**When used:** When template config specifies "header_v1".

---

## How Everything Works Together

### Scenario: User Edits Header Logo Text

```
STEP 1: User Interface
├─ User navigates to /dashboard/header
└─ HeaderEditor component loads

STEP 2: Form Initialization
├─ HeaderEditor calls useSiteContent()
├─ Redux provides current header data: { logoText: "MyWebsite" }
└─ React Hook Form initializes with this data

STEP 3: User Types
├─ User types "New Logo" in logoText input
└─ React Hook Form detects change

STEP 4: Form Processing
├─ watch() hook triggers
├─ updateHeader action is dispatched with { logoText: "New Logo" }
└─ Redux action sent to websiteSlice reducer

STEP 5: State Update
├─ websiteSlice merges new data: { ...old, logoText: "New Logo" }
├─ Redux store now contains new state
└─ localStorage is automatically updated

STEP 6: Components React
├─ useSiteContent() subscribers are notified
├─ PreviewCanvas component re-renders
├─ TemplateRenderer re-runs with new state
└─ HeaderV1 component receives new data props

STEP 7: UI Updates
├─ HeaderV1 renders: <span>"New Logo"</span>
└─ Live preview shows the change INSTANTLY
```

### Scenario: User Views Published Site at `/site/my-website`

```
STEP 1: Route Request
├─ Browser requests /site/my-website
└─ Next.js loads app/site/[slug]/page.tsx

STEP 2: Data Retrieval
├─ [slug]/page.tsx reads Redux store
├─ Gets SiteContent: { header: {...}, hero: {...}, ... }
└─ Gets current template: "aurora"

STEP 3: Template Lookup
├─ TemplateRenderer gets Aurora config
├─ Aurora config says: use header_v1, hero_v1, etc
└─ Maps each to actual React component

STEP 4: Component Rendering
├─ For each section in RENDER_ORDER:
│  ├─ Get variant string (e.g., "header_v1")
│  ├─ Look up component in sectionRegistry: HeaderV1
│  ├─ Pass data props: { data: content.header }
│  ├─ Component renders: <HeaderV1 data={content.header} />
│  └─ Repeat for hero, about, services, gallery, contact
│
├─ Final page structure:
│  <HeaderV1 data={...} />
│  <HeroV1 data={...} />
│  <AboutV1 data={...} />
│  <ServicesV1 data={...} />
│  <GalleryV1 data={...} />
│  <ContactV1 data={...} />
└─

STEP 5: HTML Served
└─ Complete HTML page sent to browser
```

---

## Common Workflows

### Adding a New Section Variant

If you wanted to add a 6th header variant (HeaderV6):

```
1. Create component
   └─ templates/sections/header/HeaderV6.tsx
      ├─ Import HeaderSectionProps from types
      └─ Follow HeaderV1-5 pattern

2. Register component
   └─ templates/registry/sectionRegistry.ts
      ├─ Import HeaderV6
      └─ Add: header_v6: HeaderV6

3. Use in template
   └─ templates/configs/template1.ts
      ├─ Update Aurora config
      └─ Change: header: "header_v1" → "header_v6"

4. Test
   └─ Visit /dashboard/preview or /dashboard/templates
   └─ Select Aurora template
   └─ HeaderV6 should appear
```

---

### Adding a New Editable Section

If you wanted to add "Services" section editing:

```
1. Define data shape
   └─ types/content.ts
      ├─ Create ServicesData interface
      └─ Add to SiteContent

2. Add to Redux
   └─ store/slices/websiteSlice.ts
      ├─ Add updateServices reducer
      └─ Initialize in DEFAULT_CONTENT

3. Create editor
   └─ components/editors/ServicesEditor.tsx
      ├─ Follow HeaderEditor pattern
      └─ Dispatch updateServices on changes

4. Create route
   └─ app/dashboard/services/page.tsx
      ├─ Import EditorShell, ServicesEditor
      └─ Render them

5. Add to sidebar
   └─ components/dashboard/nav-items.ts
      ├─ Add { href: "/dashboard/services", label: "Services" }
      └─ Sidebar will automatically show it
```

---

### How to Debug Issues

#### Issue: Data not showing in preview
```
1. Check Redux state
   └─ Open React DevTools → Redux tab
   └─ Look at store → website → [section]
   └─ Is data there?

2. If data missing
   └─ Check if editor dispatched updateAction
   └─ Look at console for dispatch logs

3. If data exists but not showing
   └─ Check component receives props
   └─ Add console.log in component: console.log('data:', data)
   └─ Check TemplateRenderer passes sectionData correctly
```

#### Issue: Editor not updating
```
1. Check form inputs
   └─ Is form being rendered?
   └─ Can you type in inputs?

2. Check React Hook Form
   └─ Add console.log in watch effect
   └─ Does dispatch fire when you type?

3. Check Redux
   └─ Open Redux DevTools
   └─ Do actions appear when you type?
   └─ Does state change after action?

4. Check persistence
   └─ Open browser DevTools → Application → localStorage
   └─ Look for "appState" key
   └─ Is it being updated?
```

---

## Quick Reference: The 5 Key Concepts

| Concept | Location | Purpose |
|---------|----------|---------|
| **Data Types** | `types/` | Define what data looks like |
| **State Management** | `store/` | Keep data in sync across app |
| **Component Registry** | `templates/registry/` | Map variant strings to React components |
| **Template Config** | `templates/configs/` | Define which component each template uses |
| **Editors** | `components/editors/` | Let users modify data |

---

## Where to Start (Recommended Order)

```
Day 1-2: Read types/ folder
  └─ Understand data shapes

Day 3-4: Read store/ folder  
  └─ Understand Redux state

Day 5-6: Read one template component (HeaderV1.tsx)
  └─ Understand how components work

Day 7: Read TemplateRenderer.tsx
  └─ Understand how it all connects

Day 8: Read one editor (HeaderEditor.tsx)
  └─ Understand how users modify data

Day 9-10: Trace through a complete workflow
  └─ User edits → Redux updates → Component rerenders
```

---

## Questions to Ask Yourself

After reading this guide, you should be able to answer:

1. ✅ **What happens when a user edits the logo text?**
2. ✅ **How does the preview know to update?**
3. ✅ **Where does the template selection happen?**
4. ✅ **How do components get their data?**
5. ✅ **Where is data persisted?**
6. ✅ **How do I add a new section variant?**
7. ✅ **What does the Redux store contain?**
8. ✅ **How does the registry system work?**
9. ✅ **Where is localStorage used?**
10. ✅ **How do the 5 template variants differ?**

---

## Need Help?

- Check the inline code comments in each file
- Use React DevTools for component inspection
- Use Redux DevTools for state inspection
- Look at the existing editors (HeaderEditor) as templates for new ones
- Look at existing components (HeaderV1) as templates for new ones

---

**Happy coding! 🚀**
