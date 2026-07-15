/**
 * ============================================================================
 * REDUX STORE CONFIGURATION — Central state management setup
 * ============================================================================
 *
 * HOW THE STORE WORKS:
 * 1. Combines 4 slices: website content, template selection, media, settings
 * 2. Persists state to localStorage so data survives page reloads
 * 3. The same persisted state is shared across:
 *    - The dashboard editor
 *    - The /preview standalone page
 *    - The /site/[slug] published site
 *
 * This means all three views always show the same data.
 */

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { migrateContent } from "@/lib/content-migrate";
import websiteReducer from "./slices/websiteSlice";
import templateReducer from "./slices/templateSlice";
import mediaReducer from "./slices/mediaSlice";
import settingsReducer from "./slices/settingsSlice";

// =============================================================================
// ROOT REDUCER — Combines all 4 state slices into one state tree
// =============================================================================

/**
 * The 4 slices of application state:
 * - website:  The actual website content (hero text, services, gallery images, etc.)
 * - template: Which template is currently selected (just an ID string)
 * - media:    Media library tracking uploaded assets
 * - settings: Site name, slug, SEO fields, publish status, preview device
 */
const rootReducer = combineReducers({
  website: websiteReducer,
  template: templateReducer,
  media: mediaReducer,
  settings: settingsReducer,
});

/** TypeScript type for the complete state tree (inferred from reducers) */
export type RootState = ReturnType<typeof rootReducer>;

// =============================================================================
// LOCAL STORAGE PERSISTENCE — Save and restore state across page reloads
// =============================================================================

/** localStorage key used for persisted state */
const STORAGE_KEY = "website-builder-state:v1";

/**
 * Attempts to load previously saved state from localStorage.
 * Returns undefined if:
 *  - Running on the server (SSR) — no window/localStorage available
 *  - No saved state exists
 *  - Saved state is corrupted/unparseable
 *
 * Ensures the state has all required fields, migrating old persisted state.
 */
function loadPersistedState(): Partial<RootState> | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const state = raw ? (JSON.parse(raw) as Partial<RootState>) : undefined;

    if (state && state.website) {
      // Sites saved before the dynamic-menu feature are a flat, single-page bag
      // of sections with a menu of plain strings. Rebuild them as pages+blocks
      // so a returning user keeps every word of their content.
      state.website = migrateContent(state.website);
    }

    // `previewDevice` is intentionally never persisted (it's stripped before
    // saving). Restore it to the SSR-safe default so the loaded state always
    // matches the server's initial render — never `undefined`.
    if (state && state.settings) {
      state.settings.previewDevice = "desktop";
    }

    return state;
  } catch {
    return undefined;
  }
}

// =============================================================================
// STORE FACTORY — Creates a new store instance
// =============================================================================

/**
 * Creates and configures the Redux store.
 * Called once per client session via StoreProvider.
 *
 * PERSISTENCE LOGIC:
 * After creation, subscribes to state changes and saves to localStorage.
 * Uses `queueMicrotask` to batch rapid updates (e.g. typing in a form)
 * into a single write, avoiding excessive localStorage calls.
 *
 * NOTE: The `previewDevice` field is NOT persisted because it's transient
 * UI state (the preview viewport size shouldn't survive a page reload).
 */
export function makeStore() {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadPersistedState(),
  });

  // --- Auto-save to localStorage on every state change ---
  if (typeof window !== "undefined") {
    let queued = false; // Prevents multiple writes per microtask cycle
    store.subscribe(() => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => {
        queued = false;
        try {
          const state = store.getState();
          // Clone settings and remove transient previewDevice before saving
          const persisted = { ...state, settings: { ...state.settings } };
          delete (persisted.settings as { previewDevice?: unknown }).previewDevice;
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
        } catch {
          /* localStorage full or unavailable — silently ignore */
        }
      });
    });
  }

  return store;
}

// =============================================================================
// EXPORTED TYPES — Used by hooks and components
// =============================================================================

/** The type of the store instance (for typing useAppStore) */
export type AppStore = ReturnType<typeof makeStore>;

/** The type of the dispatch function (for typing useAppDispatch) */
export type AppDispatch = AppStore["dispatch"];
