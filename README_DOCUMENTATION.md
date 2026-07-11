# 📚 Complete Project Documentation Hub

Welcome! This document is your **master guide** to understanding the entire project. Start here, then follow the links below.

---

## 🎯 Quick Navigation

### 👶 New to the Project?
1. **Start here:** [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md)
   - Read "Project Overview" and "Step-by-Step Learning Path"
   - Takes ~30-45 minutes to understand the basics

2. **Then read:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
   - Quick lookup guide
   - Keep nearby for reference

3. **Finally read:** [DATA_FLOW_GUIDE.md](./DATA_FLOW_GUIDE.md)
   - See exactly how data flows through the system
   - Complete code examples

### 🛠️ Ready to Build?
1. **Check:** [PRACTICAL_EXAMPLES.md](./PRACTICAL_EXAMPLES.md)
   - Copy-paste templates for common tasks
   - Step-by-step guides with code

### 🔍 Looking for Something Specific?
- Use the file reference table below
- Jump straight to the relevant documentation

---

## 📖 Documentation Files

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **[ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md)** | Complete project overview, learning path, file structure explanation | 45 min |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Quick lookup, common questions, patterns, debugging checklist | 15 min |
| **[DATA_FLOW_GUIDE.md](./DATA_FLOW_GUIDE.md)** | Detailed trace of data flow with actual code snippets | 30 min |
| **[PRACTICAL_EXAMPLES.md](./PRACTICAL_EXAMPLES.md)** | How-to guides with step-by-step instructions and copy-paste code | 60 min |

---

## 🎓 Learning Path (Recommended)

### Week 1: Understanding Fundamentals

```
Day 1: Read ARCHITECTURE_GUIDE.md
  ├─ Project Overview
  ├─ High-Level Architecture
  └─ Key Folders & Their Purpose

Day 2: Read QUICK_REFERENCE.md
  ├─ 3-Layer Architecture
  ├─ File Dependency Chain
  └─ Redux Flow

Day 3: Read DATA_FLOW_GUIDE.md (First Half)
  ├─ Follow one data change through system
  └─ Understand each step

Day 4: Read DATA_FLOW_GUIDE.md (Second Half)
  ├─ Multiple variants flow
  ├─ State persistence
  └─ Why this architecture

Day 5: Hands-On
  ├─ Open VS Code
  ├─ Read types/content.ts
  ├─ Follow data through Redux
  └─ Trace to component
```

### Week 2: Building & Extending

```
Day 6: Choose your first task from PRACTICAL_EXAMPLES.md
  ├─ Option 1: Add new header variant (easiest)
  ├─ Option 2: Add form field to existing section
  └─ Option 3: Add completely new section (hardest)

Day 7-10: Implement your chosen task
  ├─ Follow step-by-step guide
  ├─ Copy code examples
  ├─ Test and verify
  └─ Ask questions if stuck
```

---

## 🗂️ File Structure Overview

```
d:\Shanviatech Projects\templates\
├── 📖 Documentation (READ THESE FIRST)
│   ├── ARCHITECTURE_GUIDE.md      ← Comprehensive overview
│   ├── QUICK_REFERENCE.md         ← Quick lookup
│   ├── DATA_FLOW_GUIDE.md         ← Data flow explained
│   └── PRACTICAL_EXAMPLES.md      ← How-to guides
│
├── 📁 app/                        Next.js routes
│   ├── dashboard/                Dashboard section editors
│   ├── site/[slug]/               Published websites
│   └── preview/                   Full preview page
│
├── 📁 types/                      TypeScript interfaces (DATA BLUEPRINT)
│   ├── content.ts                 What data looks like
│   ├── template.ts                Template structure
│   └── section-props.ts           Component prop shapes
│
├── 📁 store/                      Redux state management (SINGLE SOURCE OF TRUTH)
│   ├── slices/                    State reducers
│   ├── index.ts                   Store configuration
│   └── hooks.ts                   Custom hooks (useSiteContent)
│
├── 📁 templates/                  Components & configurations
│   ├── sections/                  Visual components (5 variants each)
│   ├── configs/                   Template recipes (which variant to use)
│   ├── registry/                  Component lookup & renderer
│   └── theme/                     Theme utilities
│
├── 📁 components/
│   ├── editors/                   Forms for editing sections
│   ├── dashboard/                 Dashboard UI
│   ├── preview/                   Preview components
│   └── ui/                        Reusable UI elements
│
├── 📁 lib/
│   ├── schemas.ts                 Form validation (Zod)
│   ├── utils.ts                   Helper functions
│   └── theme.ts                   Theme utilities
│
├── 📁 hooks/                      Custom React hooks
│   └── useSite.ts                 useSiteContent hook
│
└── 📁 data/
    └── default-content.ts         Default website content
```

---

## 🚀 Quick Start Guide

### To View the Project:
```bash
npm run dev
# Open http://localhost:3000/dashboard
```

### To Understand How It Works:
1. Open `/dashboard/header`
2. Edit the "Logo Text" field
3. Watch the preview update in real-time
4. Inspect the Redux state (React DevTools)
5. Check localStorage (DevTools → Application → Storage)
6. Follow the data flow using [DATA_FLOW_GUIDE.md](./DATA_FLOW_GUIDE.md)

### To Add Something New:
1. Decide what you want to add
2. Find matching example in [PRACTICAL_EXAMPLES.md](./PRACTICAL_EXAMPLES.md)
3. Follow the step-by-step guide
4. Copy code examples
5. Test and verify

---

## 💡 Key Concepts (The Essentials)

### 1. **Data Lives in Redux Store**
Everything is stored centrally in Redux. Components read from it, editors write to it.

### 2. **Types Define What Data Looks Like**
Before you write any code, define your data type in `types/content.ts`. Everything else follows.

### 3. **Registry Maps Strings to Components**
"header_v1" → HeaderV1 component. This lets templates pick which component to use dynamically.

### 4. **Templates Are Config + Components**
Template = list of which variant for each section. Same data can look different with different template.

### 5. **Data Flows One Direction**
Redux State → Components → UI. Data changes → Redux updates → Components re-render.

---

## 🎯 Common Questions

### "Where do I start reading?"
→ Read [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) first

### "How does data flow through the system?"
→ See [DATA_FLOW_GUIDE.md](./DATA_FLOW_GUIDE.md)

### "How do I add something?"
→ Find your task in [PRACTICAL_EXAMPLES.md](./PRACTICAL_EXAMPLES.md)

### "Where is [something]?"
→ Check file reference in [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### "What's the pattern for [thing]?"
→ Look for pattern in [PRACTICAL_EXAMPLES.md](./PRACTICAL_EXAMPLES.md)

---

## 🔗 Component Connection Map

```
┌─────────────────────────────────────────────────────────┐
│                  DASHBOARD EDITOR                       │
│             (User types in form inputs)                 │
└────────────────┬────────────────────────────────────────┘
                 │ dispatch(updateHeader(...))
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  REDUX STORE                            │
│          (Single source of truth for data)              │
└────────────────┬────────────────────────────────────────┘
                 │ useSiteContent() hook
                 ▼
┌─────────────────────────────────────────────────────────┐
│              TEMPLATE RENDERER                          │
│        (Assembles page from config + data)              │
└────────────────┬────────────────────────────────────────┘
                 │ Pass data props + get component from registry
                 ▼
┌─────────────────────────────────────────────────────────┐
│            SECTION COMPONENTS                           │
│      (HeaderV1, HeaderV2, ... HeroV1, etc)              │
└────────────────┬────────────────────────────────────────┘
                 │ Render JSX
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  USER INTERFACE                         │
│         (What user sees in browser)                     │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ What You Should Understand After Reading

After working through the documentation, you should be able to answer:

- ✅ What files do I need to change to add a new section?
- ✅ How does the preview know when to update?
- ✅ Where is the data stored?
- ✅ How do the 5 header variants differ?
- ✅ What does Redux do?
- ✅ How do components get their data?
- ✅ What's the registry for?
- ✅ How does template switching work?
- ✅ Where is data persisted?
- ✅ How do I add a new component variant?

---

## 🛠️ Tech Stack Cheat Sheet

| Technology | Purpose | File Location |
|-----------|---------|----------------|
| **Next.js 14+** | Framework & routing | `app/` |
| **React 18+** | UI components | `components/`, `templates/` |
| **Redux Toolkit** | State management | `store/` |
| **React Hook Form** | Form handling | Component files |
| **Zod** | Type validation | `lib/schemas.ts` |
| **Tailwind CSS** | Styling | All component files |
| **TypeScript** | Type safety | `.ts` and `.tsx` files |
| **localStorage** | Data persistence | `store/index.ts` |

---

## 📞 Getting Unstuck

### If code doesn't compile:
1. Check console errors
2. Look at type definitions in `types/`
3. Compare with similar working component

### If data doesn't show in preview:
1. Check Redux DevTools for state
2. Add console.log in component
3. Check TemplateRenderer passes data correctly

### If editor doesn't update Redux:
1. Check if dispatch fires (Redux DevTools)
2. Check form validation (errors object)
3. Check watch() hook is set up

### If localStorage doesn't persist:
1. Check DevTools → Application → Storage
2. Check store/index.ts subscribe logic
3. Check for JSON serialization errors

---

## 📝 Adding to This Documentation

Found something missing? Follow this pattern:

1. Identify what's unclear
2. Check if it's in existing docs
3. Add to relevant documentation file
4. Keep examples concrete with code snippets
5. Link to related sections

---

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Understand the project architecture
- ✅ Follow data through the system
- ✅ Add new components
- ✅ Add new sections
- ✅ Modify existing functionality
- ✅ Debug issues

**Pick a learning path above and start reading!**

---

## 📚 Documentation Index

### By Topic
- **Understanding the Basics**: [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md)
- **Quick Lookup**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Data Flow**: [DATA_FLOW_GUIDE.md](./DATA_FLOW_GUIDE.md)
- **How-To Guides**: [PRACTICAL_EXAMPLES.md](./PRACTICAL_EXAMPLES.md)

### By Use Case
- **I'm new**: Start with [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md)
- **I want to build**: Read [PRACTICAL_EXAMPLES.md](./PRACTICAL_EXAMPLES.md)
- **I need a quick answer**: Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **I want to understand deeply**: Read [DATA_FLOW_GUIDE.md](./DATA_FLOW_GUIDE.md)

---

**Last Updated:** 2026-06-23

**Questions?** Check the relevant guide or trace through actual code using the guides!

Happy coding! 🚀
