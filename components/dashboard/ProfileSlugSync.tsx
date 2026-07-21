"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateSettings } from "@/store/slices/settingsSlice";
import { useSettings } from "@/hooks/useSite";
import { getProfileSlug } from "@/lib/auth-profile";

/**
 * Keeps the site's slug equal to the signed-in user's slug.
 *
 * The published site is served from `/<slug>`, and that slug is the account's —
 * `/test999`, not a slugified site name. The profile only exists in
 * localStorage, so this runs in an effect after hydration rather than in the
 * store's initial state, which would make the server and client first renders
 * disagree.
 *
 * Renders nothing; mounted once from the dashboard layout.
 */
export function ProfileSlugSync() {
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const currentSlug = settings.slug;

  useEffect(() => {
    const profileSlug = getProfileSlug();
    if (profileSlug && profileSlug !== currentSlug) {
      dispatch(updateSettings({ slug: profileSlug }));
    }
  }, [dispatch, currentSlug]);

  return null;
}
