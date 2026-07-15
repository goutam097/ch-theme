"use client";

import { useEffect, useRef } from "react";
import type { FieldValues, UseFormWatch } from "react-hook-form";

/**
 * Push every keystroke from a react-hook-form up to the owner.
 *
 * Editors are CONTROLLED now: they don't know which page or block they're
 * editing and never touch Redux themselves. They just render the `data` they're
 * given and call `onChange` with the whole new value — the block editor decides
 * what that means (`updateBlock` for the right page + block id).
 *
 * `onChange` is kept in a ref so a caller passing a fresh inline arrow function
 * on every render doesn't tear down and rebuild the watch subscription.
 */
export function useFormSync<TForm extends FieldValues, TOut>(
  watch: UseFormWatch<TForm>,
  onChange: (value: TOut) => void,
): void {
  const latest = useRef(onChange);

  // Refresh the ref in an effect, not during render — a render can be thrown
  // away or replayed, and writing to a ref then is a React rules violation.
  useEffect(() => {
    latest.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const sub = watch((values) => latest.current(values as TOut));
    return () => sub.unsubscribe();
  }, [watch]);
}
