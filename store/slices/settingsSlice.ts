import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PreviewDevice, SiteSettings } from "@/types";

interface SettingsState extends SiteSettings {
  /** Transient UI state: which viewport the live preview is emulating. */
  previewDevice: PreviewDevice;
}

const initialState: SettingsState = {
  siteName: "Your Studio",
  // The published URL is `/<slug>`, and the slug IS the signed-in user's slug
  // (e.g. "test999"), not something derived from the site name. It's filled in
  // from the auth profile once the client hydrates — see <ProfileSlugSync/>.
  // Blank until then, so nothing ever publishes under a made-up slug.
  slug: "",
  seoTitle: "Your Studio — Crafted digital experiences",
  seoDescription:
    "We design and build beautiful, fast websites that turn visitors into customers.",
  favicon: "",
  socialImage: "",
  status: "draft",
  publishedAt: null,
  // Consistent, SSR-safe default. Never derived from a browser API so the
  // server and the initial client render always agree. This value is transient
  // (not persisted) — see the persistence logic in `store/index.ts`.
  previewDevice: "desktop",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SiteSettings>>) => {
      Object.assign(state, action.payload);
    },
    setPreviewDevice: (state, action: PayloadAction<PreviewDevice>) => {
      state.previewDevice = action.payload;
    },
    publishSite: (state, action: PayloadAction<string>) => {
      state.status = "published";
      state.publishedAt = action.payload; // ISO timestamp passed in by caller
    },
    unpublishSite: (state) => {
      state.status = "draft";
      state.publishedAt = null;
    },
  },
});

export const { updateSettings, setPreviewDevice, publishSite, unpublishSite } =
  settingsSlice.actions;
export default settingsSlice.reducer;
