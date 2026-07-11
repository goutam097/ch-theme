# 🔄 Complete Data Flow with Code Examples

## Overview: How a User Change Flows Through the System

This document traces exactly what happens when a user edits the header logo text, with actual code from the codebase.

---

## Step 1: User Opens the Editor

### Route: `/dashboard/header`

**File:** `app/dashboard/header/page.tsx`
```typescript
export default function HeaderEditorPage() {
  return (
    <EditorShell title="Header" description="Customize your site header">
      <HeaderEditor />  {/* ← This is what renders */}
    </EditorShell>
  );
}
```

---

## Step 2: Editor Component Loads

**File:** `components/editors/HeaderEditor.tsx`

### 2A: Get Current Data from Redux

```typescript
export function HeaderEditor() {
  const content = useSiteContent();  // ← Get Redux state
  
  // Safe access with fallback
  const header = content?.header || { 
    logoText: "MyWebsite", 
    logoImage: "", 
    menuItems: ["Home", "About", "Services", "Gallery", "Contact"] 
  };
  
  const dispatch = useAppDispatch();  // ← Get dispatch function
```

**What is `useSiteContent()`?**

**File:** `hooks/useSite.ts`
```typescript
export function useSiteContent(): SiteContent | undefined {
  return useAppSelector((state) => state.website);
  // Returns: state.website from Redux
  // Which contains: { header, hero, about, services, gallery, contact }
}
```

### 2B: Initialize Form with Current Data

```typescript
  const { register, watch, setValue, formState: { errors } } = useForm<HeaderFormValues>({
    resolver: zodResolver(headerSchema),  // ← Validation schema
    mode: "onChange",                      // ← Validate on every keystroke
    defaultValues: {
      logoText: header?.logoText || "MyWebsite",           // ← Current value
      logoImage: header?.logoImage || "",                  // ← Current value
      menuItems: header?.menuItems || ["Home", "About"],   // ← Current value
    },
  });
```

### 2C: Set Up Live Sync

```typescript
  // This effect runs every time the form values change
  useEffect(() => {
    const subscription = watch((values) => {
      // values = { logoText: "...", logoImage: "...", menuItems: [...] }
      
      // Send to Redux
      dispatch(updateHeader(values as Partial<HeaderFormValues>));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);
```

### 2D: Render Form Inputs

```typescript
  return (
    <form className="space-y-5">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <p className="mb-4 text-xs font-medium text-zinc-500">
          Logo — choose text, image, or both
        </p>
        
        {/* LOGO TEXT INPUT */}
        <Field label="Logo Text" error={errors.logoText?.message}>
          <Input 
            {...register("logoText")}  {/* ← Connects to form state */}
            placeholder="MyWebsite" 
          />
        </Field>
        
        {/* LOGO IMAGE INPUT */}
        <Field label="Logo Image URL" error={errors.logoImage?.message}>
          <Input 
            {...register("logoImage")}  {/* ← Connects to form state */}
            placeholder="https://…" 
          />
        </Field>
        
        {/* MENU ITEMS TEXTAREA */}
        <Field label="Menu Items" error={errors.menuItems?.message}>
          <Textarea
            rows={5}
            value={menuItems.join("\n")}  {/* Display as lines */}
            onChange={handleMenuItemsChange}  {/* ← Handler below */}
            placeholder="Home&#10;About&#10;Services"
          />
        </Field>
      </div>
    </form>
  );
}
```

---

## Step 3: User Types in Form

### Example: User types "New Logo" in the logoText input

**In React Hook Form:**
```
1. User types "New Logo"
2. onChange event fires
3. React Hook Form detects change in registered input
4. Calls setValue() internally
5. watch() hook detects the new values
6. Triggers the useEffect subscription
```

---

## Step 4: Dispatch Redux Action

**File:** `components/editors/HeaderEditor.tsx` (inside useEffect)

```typescript
useEffect(() => {
  const subscription = watch((values) => {
    // values = { logoText: "New Logo", logoImage: "...", menuItems: [...] }
    
    dispatch(updateHeader(values as Partial<HeaderFormValues>));
    //      ^^^^^^^^^^^^^^ This is the action
  });
}, [watch, dispatch]);
```

**What is `updateHeader`?**

**File:** `store/slices/websiteSlice.ts`

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SiteContent } from "@/types/content";
import { DEFAULT_CONTENT } from "@/data/default-content";

const initialState: SiteContent = DEFAULT_CONTENT;

export const websiteSlice = createSlice({
  name: "website",
  initialState,
  reducers: {
    // ← This is the reducer that updates state
    updateHeader: (state, action: PayloadAction<Partial<HeaderData>>) => {
      // Merge new values with existing header
      state.header = { ...state.header, ...action.payload };
      // Result: { logoText: "New Logo", logoImage: "...", menuItems: [...] }
    },
    
    updateHero: (state, action) => {
      state.hero = { ...state.hero, ...action.payload };
    },
    // ... similar for about, services, gallery, contact
  },
});

export const { updateHeader, updateHero, ... } = websiteSlice.actions;
export default websiteSlice.reducer;
```

---

## Step 5: Redux State Updates

### Before Action
```javascript
state = {
  website: {
    header: {
      logoText: "MyWebsite",
      logoImage: "",
      menuItems: ["Home", "About"]
    },
    hero: { ... },
    about: { ... },
    // ...
  },
  template: { ... },
  settings: { ... }
}
```

### Action Dispatched
```javascript
dispatch(updateHeader({ 
  logoText: "New Logo"  // ← Only this changed
}))
```

### After Action
```javascript
state = {
  website: {
    header: {
      logoText: "New Logo",  // ← Updated!
      logoImage: "",         // ← Unchanged (kept from spread)
      menuItems: ["Home", "About"]  // ← Unchanged
    },
    hero: { ... },
    about: { ... },
    // ...
  },
  template: { ... },
  settings: { ... }
}
```

---

## Step 6: Auto-Save to localStorage

**File:** `store/index.ts`

```typescript
import { configureStore } from "@reduxjs/toolkit";
import websiteReducer from "./slices/websiteSlice";

// 1. Load persisted state from localStorage
function loadPersistedState() {
  try {
    const saved = localStorage.getItem("appState");
    if (saved) {
      const state = JSON.parse(saved);
      // Migrate old state (add header if missing)
      if (!state.website.header) {
        state.website.header = { logoText: "MyWebsite", ... };
      }
      return state;
    }
  } catch (e) {
    console.error("Failed to load persisted state:", e);
  }
  return undefined;
}

// 2. Create store
export const store = configureStore({
  reducer: {
    website: websiteReducer,
    template: templateReducer,
    settings: settingsReducer,
    media: mediaReducer,
  },
  preloadedState: loadPersistedState(),
});

// 3. Save to localStorage whenever state changes
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("appState", JSON.stringify(state));
  //                                ^^^^^^^^^^^^^^^^ Persisted!
});
```

**Result:** Browser storage now contains:
```javascript
localStorage["appState"] = {
  "website": {
    "header": {
      "logoText": "New Logo",  // ← Saved!
      "logoImage": "",
      "menuItems": ["Home", "About"]
    },
    // ...
  }
}
```

---

## Step 7: Components Re-Render

### 7A: Subscribers Get Notified

**Any component using `useSiteContent()` is notified:**

```typescript
const content = useSiteContent();  // Gets new state
// content.header.logoText = "New Logo"
```

### 7B: Preview Canvas Re-Renders

**File:** `components/preview/PreviewCanvas.tsx`

```typescript
export function PreviewCanvas() {
  const templateId = useAppSelector((state) => state.template.id);
  const content = useSiteContent();  // ← Gets new state!
  
  return (
    <TemplateRenderer templateId={templateId} content={content} />
    //                                        ^^^^^^^ Updated!
  );
}
```

---

## Step 8: TemplateRenderer Processes Data

**File:** `templates/registry/TemplateRenderer.tsx`

```typescript
export function TemplateRenderer({ templateId }: Props) {
  // 1. Get template config
  const template = getTemplate(templateId);
  // Returns: { name: "Aurora", home: { header: "header_v1", hero: "hero_v1", ... } }
  
  // 2. Get site content from Redux
  const content = useSiteContent();
  // Returns: { header: { logoText: "New Logo", ... }, hero: { ... }, ... }
  
  // 3. Build section data map
  const sectionData: SectionContentMap = {
    header: content.header,    // ← This now has "New Logo"
    hero: content.hero,
    about: content.about,
    services: content.services,
    gallery: content.gallery,
    contact: content.contact,
  };
  
  // 4. Render each section
  return (
    <div>
      {RENDER_ORDER.map((section) => {
        // For each section (header, hero, about, ...)
        
        // Get the variant string
        const variant = template.home[section];  // e.g., "header_v1"
        
        // Get the component from registry
        const Component = getSectionComponent(variant);  // e.g., HeaderV1
        
        // Get the section data
        const data = sectionData[section];  // e.g., { logoText: "New Logo", ... }
        
        // Render with data props
        return (
          <Component key={section} data={data} theme={theme} />
        );
      })}
    </div>
  );
}
```

### What is `getSectionComponent`?

**File:** `templates/registry/sectionRegistry.ts`

```typescript
import HeaderV1 from "@/templates/sections/header/HeaderV1";
import HeaderV2 from "@/templates/sections/header/HeaderV2";
// ... imports for all 5 variants of each section

export const sectionRegistry = {
  // Header variants
  header_v1: HeaderV1,
  header_v2: HeaderV2,
  header_v3: HeaderV3,
  header_v4: HeaderV4,
  header_v5: HeaderV5,
  
  // Hero variants
  hero_v1: HeroV1,
  // ... etc for all sections
};

export function getSectionComponent(variant: string) {
  return sectionRegistry[variant];
  // Input: "header_v1"
  // Output: HeaderV1 component
}
```

---

## Step 9: Component Renders

**File:** `templates/sections/header/HeaderV1.tsx`

```typescript
import { HeaderSectionProps } from "@/types/section-props";

export function HeaderV1({ data, theme }: HeaderSectionProps) {
  // Receive data props from TemplateRenderer
  // data = { logoText: "New Logo", logoImage: "", menuItems: ["Home", "About"] }
  
  // Use data with safe fallbacks
  const logoText = data?.logoText || "MyWebsite";
  // logoText = "New Logo"  ← Gets the updated value!
  
  const menuItems = data?.menuItems || ["Home", "About"];
  // menuItems = ["Home", "About"]
  
  // Render JSX
  return (
    <header className="flex items-center justify-between bg-white shadow">
      {/* LOGO SECTION */}
      <div className="flex items-center gap-2">
        {/* Render logo image if provided */}
        {data?.logoImage && (
          <img 
            src={data.logoImage} 
            alt="Logo" 
            className="h-8 object-contain" 
          />
        )}
        
        {/* Render logo text */}
        {logoText && (
          <span className="text-xl font-bold text-gray-900">
            {logoText}  {/* ← Shows "New Logo" */}
          </span>
        )}
      </div>
      
      {/* NAVIGATION SECTION */}
      <nav className="flex gap-6">
        {menuItems.map((item) => (
          <a 
            key={item}
            href="#" 
            className="text-gray-600 hover:text-gray-900"
          >
            {item}  {/* ← "Home", "About" */}
          </a>
        ))}
      </nav>
    </header>
  );
}
```

---

## Step 10: UI Updates in Browser

```
React renders JSX:
<header className="...">
  <div>
    <span>New Logo</span>  ← Updated!
  </div>
  <nav>
    <a>Home</a>
    <a>About</a>
  </nav>
</header>

Browser displays:
┌─────────────────────────────────────┐
│ New Logo       Home    About         │
└─────────────────────────────────────┘
     ↑
  Changed from "MyWebsite" to "New Logo"
```

---

## Complete Data Journey Summary

```
1. User types "New Logo" in input
         ↓
2. React Hook Form detects change
         ↓
3. watch() hook triggers
         ↓
4. dispatch(updateHeader({ logoText: "New Logo" }))
         ↓
5. Redux reducer updates state.header.logoText
         ↓
6. localStorage saved with new value
         ↓
7. useSiteContent() subscribers notified
         ↓
8. PreviewCanvas re-renders
         ↓
9. TemplateRenderer builds section data
         ↓
10. Gets HeaderV1 component from registry
         ↓
11. Passes data: { logoText: "New Logo", ... }
         ↓
12. HeaderV1 renders <span>"New Logo"</span>
         ↓
13. Browser displays: New Logo (instead of MyWebsite)
```

**Total time: ~50-100ms (Feels instant to user!)**

---

## Multiple Variants Flow

When user switches to Aurora template with HeaderV2:

```
1. User clicks Aurora template in /dashboard/templates
         ↓
2. dispatch(setTemplate("aurora"))
         ↓
3. Redux updates: template.id = "aurora"
         ↓
4. PreviewCanvas re-renders
         ↓
5. TemplateRenderer reads config:
   Aurora.home = { header: "header_v2", hero: "hero_v1", ... }
         ↓
6. Gets HeaderV2 from sectionRegistry
         ↓
7. Passes same data: { logoText: "New Logo", ... }
         ↓
8. HeaderV2 renders (different styling, same data!)
         ↓
9. Preview shows new header design with "New Logo"
```

**The data stays the same, only the component changes!**

---

## State Persistence Flow

```
App Startup:
1. store/index.ts loads
2. loadPersistedState() reads localStorage
3. Redux initialized with saved state
4. All components get data from Redux
5. If localStorage missing, uses DEFAULT_CONTENT

User Makes Changes:
1. dispatch(updateHeader(...))
2. store.subscribe() fires
3. New state saved to localStorage
4. Components re-render with new data

Browser Refresh:
1. localStorage restored
2. App boots with same state
3. User picks up where they left off
```

---

## Why This Architecture?

| Layer | Why |
|-------|-----|
| **Types** | Single source of truth for data shape |
| **Redux** | Centralized state, easy to debug, persistence |
| **Registry** | Dynamic component selection (5 variants per section) |
| **TemplateRenderer** | One place that knows how to render any template |
| **Components** | Reusable, accept data props, no hardcoded content |

This separation makes the code:
- **Scalable**: Add new variant? Just add component + registry entry
- **Maintainable**: Each file has one responsibility
- **Debuggable**: Redux DevTools shows exactly what changed
- **Reactive**: Components update instantly when data changes

---

## Testing This Flow

Open browser console and try:

```javascript
// 1. See current Redux state
window.__REDUX_DEVTOOLS_EXTENSION__()

// 2. See localStorage
JSON.parse(localStorage.getItem("appState"))

// 3. Edit form and watch:
//    - Redux actions appear in Redux DevTools
//    - localStorage updates
//    - Preview rerenders
```

---

**🎯 You now understand the complete data flow!**

This flow applies to ALL sections (Hero, About, Services, Gallery, Contact) - only the data types and component variants change.
