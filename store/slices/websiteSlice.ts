/**
 * ============================================================================
 * WEBSITE SLICE — Stores ALL website content (the pages and their blocks)
 * ============================================================================
 *
 * THIS IS THE HEART OF THE APP.
 *
 * WHY THIS MATTERS:
 * This slice holds template-AGNOSTIC content. When a user switches from
 * template "Aurora" to "Pulse", this slice is NEVER touched — the content stays
 * identical and only the visual presentation changes. That's what makes
 * template switching lossless.
 *
 * WHAT'S STORED:
 * `{ header, pages[] }`. Each page owns an ordered list of blocks, and each
 * block owns its own data. The navigation menu is derived from `pages` (see
 * `lib/nav.ts`) — adding a page here is what adds a menu item on the site.
 *
 * WHO WRITES TO THIS:
 * - The Pages manager (add / rename / delete / reorder / show in menu)
 * - The per-page block editor (add / remove / reorder blocks, and edit their
 *   content on every keystroke, which instantly updates the live preview)
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_CONTENT } from "@/data/default-content";
import { createBlock, createPage, uniqueSlug } from "@/lib/blocks";
import type {
  BlockType,
  HeaderData,
  PageBlock,
  SiteContent,
  SitePage,
} from "@/types";

/** Start with seed content on first load (localStorage overrides this if present). */
const initialState: SiteContent = DEFAULT_CONTENT;

/** Move an item within an array, in place. No-op if either index is out of range. */
function moveWithin<T>(arr: T[], from: number, to: number): void {
  if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return;
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
}

const websiteSlice = createSlice({
  name: "website",
  initialState,
  reducers: {
    /** Replace ALL content at once (used when loading/importing a site). */
    setContent: (_state, action: PayloadAction<SiteContent>) => action.payload,

    /** Partially update the header branding. Called by HeaderEditor per keystroke. */
    updateHeader: (state, action: PayloadAction<Partial<HeaderData>>) => {
      state.header = { ...state.header, ...action.payload };
    },

    // ----------------------------------------------------------------- PAGES

    /**
     * Add a page from a menu label. The slug is derived from the label and
     * de-duplicated, and the page shows in the menu immediately — which is what
     * makes the site's navigation grow with the user's pages.
     */
    addPage: (state, action: PayloadAction<{ label: string }>) => {
      state.pages.push(createPage(action.payload.label, state.pages));
    },

    /**
     * Rename a page, toggle its menu visibility, or set its slug.
     *
     * Renaming re-derives the slug ONLY when the user hasn't hand-edited it —
     * we can't tell, so we simply keep an explicit `slug` in the payload if one
     * is given, and otherwise leave the existing slug alone. The home page's
     * slug is always "" and is never touched.
     */
    updatePage: (
      state,
      action: PayloadAction<{
        pageId: string;
        patch: Partial<Pick<SitePage, "label" | "slug" | "showInMenu">>;
      }>,
    ) => {
      const { pageId, patch } = action.payload;
      const page = state.pages.find((p) => p.id === pageId);
      if (!page) return;

      if (patch.label !== undefined) page.label = patch.label;
      if (patch.showInMenu !== undefined) page.showInMenu = patch.showInMenu;

      // The home page is always served at the base path, so it keeps slug "".
      if (patch.slug !== undefined && !page.isHome) {
        page.slug = uniqueSlug(patch.slug, state.pages, page.id);
      }
    },

    /** Delete a page. The home page is protected — the site must always have one. */
    removePage: (state, action: PayloadAction<string>) => {
      const page = state.pages.find((p) => p.id === action.payload);
      if (!page || page.isHome) return;
      state.pages = state.pages.filter((p) => p.id !== action.payload);
    },

    /** Reorder pages — this is also the order the menu links appear in. */
    reorderPages: (
      state,
      action: PayloadAction<{ from: number; to: number }>,
    ) => {
      moveWithin(state.pages, action.payload.from, action.payload.to);
    },

    // ---------------------------------------------------------------- BLOCKS

    /** Append a new block (with starter content) to a page. */
    addBlock: (
      state,
      action: PayloadAction<{ pageId: string; type: BlockType }>,
    ) => {
      const page = state.pages.find((p) => p.id === action.payload.pageId);
      if (!page) return;
      page.blocks.push(createBlock(action.payload.type));
    },

    /**
     * Update one block's content. Called by the block editors on every
     * keystroke, so the live preview tracks typing.
     *
     * `data` REPLACES the block's data rather than merging it: array blocks
     * (services, gallery) need removal to work, and a merge can't express
     * "this item is gone". The editors always send the complete value.
     */
    updateBlock: (
      state,
      action: PayloadAction<{
        pageId: string;
        blockId: string;
        data: PageBlock["data"];
      }>,
    ) => {
      const page = state.pages.find((p) => p.id === action.payload.pageId);
      const block = page?.blocks.find((b) => b.id === action.payload.blockId);
      if (!block) return;
      (block as { data: PageBlock["data"] }).data = action.payload.data;
    },

    /** Remove a block from a page. A page is allowed to end up empty. */
    removeBlock: (
      state,
      action: PayloadAction<{ pageId: string; blockId: string }>,
    ) => {
      const page = state.pages.find((p) => p.id === action.payload.pageId);
      if (!page) return;
      page.blocks = page.blocks.filter((b) => b.id !== action.payload.blockId);
    },

    /** Reorder blocks within a page — this is the top-to-bottom page layout. */
    moveBlock: (
      state,
      action: PayloadAction<{ pageId: string; from: number; to: number }>,
    ) => {
      const page = state.pages.find((p) => p.id === action.payload.pageId);
      if (!page) return;
      moveWithin(page.blocks, action.payload.from, action.payload.to);
    },

    /** Reset all content back to the default seed data. */
    resetContent: () => DEFAULT_CONTENT,
  },
});

export const {
  setContent,
  updateHeader,
  addPage,
  updatePage,
  removePage,
  reorderPages,
  addBlock,
  updateBlock,
  removeBlock,
  moveBlock,
  resetContent,
} = websiteSlice.actions;

export default websiteSlice.reducer;
