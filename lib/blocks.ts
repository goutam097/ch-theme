/**
 * ============================================================================
 * BLOCK & PAGE FACTORIES — How new pages and content blocks are born.
 * ============================================================================
 *
 * Everything the user "adds" in the dashboard (a page, a block) is created
 * here, so every new object gets a stable id and sensible starter content.
 *
 * ID GENERATION: ids are only ever minted in response to a user action (a click
 * in the dashboard), never during render, so they can't cause a server/client
 * hydration mismatch. The seed content in `data/default-content.ts` uses
 * hard-coded ids for the same reason.
 */

import type {
  BlockDataMap,
  BlockType,
  PageBlock,
  SitePage,
} from "@/types";

/** Mint a unique id. Falls back to a random string on older browsers. */
export function uid(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${prefix}_${rand}`;
}

// =============================================================================
// SLUGS — Turning a menu label into a URL segment
// =============================================================================

/**
 * "Our Team!" → "our-team". Returns "" for input that has no usable characters,
 * which the caller must handle (see `uniqueSlug`).
 */
export function slugify(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics collapse to a single dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}

/**
 * Slugify `label`, then guarantee it collides with no other page. `excludeId`
 * lets a page keep its own slug while being renamed.
 *
 * Note the home page always holds the empty slug "", so a normal page can never
 * be given one — a label that slugifies to nothing falls back to "page".
 */
export function uniqueSlug(
  label: string,
  pages: SitePage[],
  excludeId?: string,
): string {
  const base = slugify(label) || "page";
  const taken = new Set(
    pages.filter((p) => p.id !== excludeId).map((p) => p.slug),
  );

  if (!taken.has(base)) return base;

  // "about" is taken → try "about-2", "about-3", …
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

// =============================================================================
// BLOCK DEFAULTS — The starter content a freshly-added block shows
// =============================================================================

/**
 * Starter content for each block type. A new block is never empty — the user
 * sees something real in the preview immediately and edits from there.
 *
 * Returns a fresh deep copy every call, so two blocks of the same type never
 * end up sharing a mutable array/object.
 */
const BLOCK_DEFAULTS: { [T in BlockType]: () => BlockDataMap[T] } = {
  hero: () => ({
    title: "Your headline goes here",
    subtitle: "A short eyebrow line",
    description:
      "Introduce what you do in a sentence or two. Keep it short and specific.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    video: "",
    carousel: [],
    buttonText: "Get started",
    buttonLink: "#contact",
  }),
  about: () => ({
    title: "About us",
    description:
      "Tell your story here — who you are, what you care about, and why customers should trust you.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  }),
  services: () => [
    {
      title: "Your first service",
      description: "Describe what this service includes and who it's for.",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    },
  ],
  gallery: () => [
    {
      image:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
    },
  ],
  contact: () => ({
    phone: "+1 (555) 012-3456",
    email: "hello@example.com",
    address: "120 Market Street, San Francisco, CA",
    mapUrl:
      "https://www.google.com/maps?q=120+Market+Street+San+Francisco&output=embed",
  }),
  // API-backed sections start with an empty source slug — the user only picks
  // WHICH collection to show; the items themselves come from the backend.
  event: () => ({ slug: "" }),
  group: () => ({ slug: "" }),
  video: () => ({ slug: "" }),
  podcast: () => ({ slug: "" }),
  audio: () => ({ slug: "" }),
};

/** Create a new block of `type`, pre-filled with starter content. */
export function createBlock<T extends BlockType>(type: T): PageBlock {
  return {
    id: uid("blk"),
    type,
    data: BLOCK_DEFAULTS[type](),
  } as PageBlock;
}

// =============================================================================
// PAGE FACTORY
// =============================================================================

/**
 * Create a new page from a menu label. The slug is derived from the label and
 * de-duplicated against `pages`. New pages start with a hero block so they are
 * never a blank white screen in the preview.
 */
export function createPage(label: string, pages: SitePage[]): SitePage {
  const name = label.trim() || "New page";
  return {
    id: uid("pg"),
    label: name,
    slug: uniqueSlug(name, pages),
    isHome: false,
    showInMenu: true,
    blocks: [createBlock("hero")],
  };
}
