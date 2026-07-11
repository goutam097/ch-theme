/**
 * ============================================================================
 * WEBSITE SLICE — Stores ALL website content (hero, about, services, etc.)
 * ============================================================================
 *
 * THIS IS THE HEART OF THE APP.
 *
 * WHY THIS MATTERS:
 * This slice holds the template-AGNOSTIC content. When a user switches
 * from Template "Aurora" to Template "Pulse", this slice is NEVER touched.
 * The content stays exactly the same — only the visual presentation changes.
 * This is what makes template switching "lossless".
 *
 * WHAT'S STORED:
 * The entire SiteContent object: hero data, about data, services array,
 * gallery array, and contact data.
 *
 * WHO WRITES TO THIS:
 * The editor components (HeroEditor, AboutEditor, etc.) dispatch actions
 * here on every keystroke, which instantly updates the live preview.
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_CONTENT } from "@/data/default-content";
import type {
  AboutData,
  ContactData,
  GalleryItem,
  HeaderData,
  HeroData,
  ServiceItem,
  SiteContent,
} from "@/types";

/** Start with seed/default content on first load */
const initialState: SiteContent = DEFAULT_CONTENT;

const websiteSlice = createSlice({
  name: "website",
  initialState,
  reducers: {
    /**
     * Replace ALL content at once.
     * Used for bulk operations like resetting or importing content.
     */
    setContent: (_state, action: PayloadAction<SiteContent>) => action.payload,

    /**
     * Partially update header data.
     * Called by HeaderEditor on every keystroke.
     */
    updateHeader: (state, action: PayloadAction<Partial<HeaderData>>) => {
      state.header = { ...state.header, ...action.payload };
    },

    /**
     * Partially update hero data.
     * Called by HeroEditor on every keystroke for live preview.
     * Example: dispatch(updateHero({ title: "New Headline" }))
     */
    updateHero: (state, action: PayloadAction<Partial<HeroData>>) => {
      state.hero = { ...state.hero, ...action.payload };
    },

    /**
     * Partially update about data.
     * Called by AboutEditor on every keystroke.
     */
    updateAbout: (state, action: PayloadAction<Partial<AboutData>>) => {
      state.about = { ...state.about, ...action.payload };
    },

    /**
     * Partially update contact data.
     * Called by ContactEditor on every keystroke.
     */
    updateContact: (state, action: PayloadAction<Partial<ContactData>>) => {
      state.contact = { ...state.contact, ...action.payload };
    },

    /**
     * Replace the entire services array.
     * Called by ServicesEditor when items are added, removed, or edited.
     */
    setServices: (state, action: PayloadAction<ServiceItem[]>) => {
      state.services = action.payload;
    },

    /**
     * Replace the entire gallery array.
     * Called by GalleryEditor when images are added, removed, or edited.
     */
    setGallery: (state, action: PayloadAction<GalleryItem[]>) => {
      state.gallery = action.payload;
    },

    /** Reset all content back to the default seed data */
    resetContent: () => DEFAULT_CONTENT,
  },
});

// Export individual actions so editors can dispatch them
export const {
  setContent,
  updateHeader,
  updateHero,
  updateAbout,
  updateContact,
  setServices,
  setGallery,
  resetContent,
} = websiteSlice.actions;

export default websiteSlice.reducer;
