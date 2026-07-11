"use client";

import { useSyncExternalStore } from "react";

/** No-op subscription: the hydration flag never changes after mount. */
const subscribe = () => () => {};

/**
 * Returns `false` on the server and during the first client render, then `true`
 * after hydration. Use it to gate UI that depends on client-only persisted
 * state (the Redux store hydrates from localStorage, so persisted values differ
 * from the server's initial render). Rendering the server-consistent value
 * until this flips avoids hydration mismatches.
 *
 * Implemented with `useSyncExternalStore` so the server/first-render snapshot is
 * `false` and the post-hydration client snapshot is `true` — the hydration-safe
 * pattern (no setState-in-effect).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}
