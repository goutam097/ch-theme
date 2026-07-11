/**
 * ============================================================================
 * STORE PROVIDER — Client-side wrapper that makes Redux available to the app
 * ============================================================================
 *
 * WHERE THIS IS USED:
 * Wraps the entire app in `app/layout.tsx`, so every page and component
 * can access the Redux store via hooks (useAppSelector, useAppDispatch).
 *
 * WHY `useState(() => makeStore())`:
 * - The lazy initializer creates the store exactly ONCE per client session
 * - It survives React re-renders (store isn't recreated on every render)
 * - On the server, each request gets a fresh store instance
 * - This follows Redux's official guidance for Next.js App Router
 */

"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./index";

export function StoreProvider({ children }: { children: ReactNode }) {
  // Create the store once and reuse it for the lifetime of this client session
  const [store] = useState(() => makeStore());
  return <Provider store={store}>{children}</Provider>;
}
