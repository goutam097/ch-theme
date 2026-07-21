/**
 * ============================================================================
 * AUTH PROFILE — the signed-in user, as stashed by the SSO flow.
 * ============================================================================
 *
 * `app/page.tsx` writes the profile response to localStorage under
 * `auth_profile` after SSO. Everything that needs a fact about the user reads
 * it through here rather than parsing that blob itself.
 *
 * The backend's response nesting isn't pinned down, so each getter probes the
 * usual envelopes (`{...}`, `{data}`, `{user}`, `{data.user}`) and the usual
 * casings. If the real shape turns out to be something else, this file is the
 * only place that has to change.
 */

const STORAGE_KEY = "auth_profile";

/** Every object a profile field might plausibly live on. */
function profileSources(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved) as Record<string, unknown>;
    return [parsed, parsed?.data, parsed?.user, (parsed?.data as Record<string, unknown>)?.user]
      .filter((s): s is Record<string, unknown> => !!s && typeof s === "object");
  } catch {
    return [];
  }
}

/** First non-empty string found under any of `keys`, across all envelopes. */
function pick(keys: string[]): string {
  for (const source of profileSources()) {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return "";
}

/**
 * The user's own slug (e.g. "test999") — the account's identity everywhere:
 * the published site lives at `/<slug>`, and the API-backed sections load
 * their items for it. Empty when signed out or when SSO returned no slug.
 */
export function getProfileSlug(): string {
  return pick(["slug"]);
}

/** Images saved on the profile, for the header's logo picker. */
export function getProfileImages(): { companyLogo: string; profileIcon: string } {
  return {
    companyLogo: pick(["company_logo", "companyLogo"]),
    profileIcon: pick(["profile_icon", "profileIcon", "profile_image", "profileImage"]),
  };
}
