/**
 * ============================================================================
 * TYPED REDUX HOOKS — Always use these instead of the plain React-Redux hooks
 * ============================================================================
 *
 * WHY: The plain `useDispatch` and `useSelector` from react-redux don't know
 * about our specific state shape or action types. These typed versions do,
 * so you get autocomplete and type checking throughout the app.
 *
 * USAGE:
 *   import { useAppSelector, useAppDispatch } from "@/store/hooks";
 *
 *   const content = useAppSelector((state) => state.website);  // ← fully typed!
 *   const dispatch = useAppDispatch();
 *   dispatch(updateHero({ title: "New title" }));              // ← fully typed!
 */

import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./index";

/** Typed dispatch hook — knows all available actions */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** Typed selector hook — knows the exact shape of the state tree */
export const useAppSelector = useSelector.withTypes<RootState>();

/** Typed store hook — rarely needed, but available if you need direct store access */
export const useAppStore = useStore.withTypes<AppStore>();
