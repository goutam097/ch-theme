"use client";

import { use } from "react";
import Link from "next/link";
import { EditorShell } from "@/components/dashboard/EditorShell";
import { PageBlocksEditor } from "@/components/dashboard/PageBlocksEditor";
import { usePage } from "@/hooks/useSite";
import { useHydrated } from "@/hooks/useHydrated";

/**
 * Edit ONE page: its menu/URL settings and its stack of content blocks, with a
 * live preview of that same page on the right.
 *
 * The route is dynamic (`[pageId]`) because pages are user-created — there is no
 * fixed set of them to hard-code routes for, which is the whole point of the
 * feature.
 *
 * `params` is a Promise in this version of Next.js; a Client Component unwraps
 * it with React's `use()`.
 */
export default function PageContentEditor({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = use(params);
  const hydrated = useHydrated();
  const page = usePage(pageId);

  // Content lives in localStorage, so it isn't there on the server render.
  if (!hydrated) {
    return <div className="p-6 text-sm text-zinc-400">Loading page…</div>;
  }

  // The page was deleted, or someone hand-typed an id.
  if (!page) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-900">Page not found</h1>
        <p className="text-sm text-zinc-500">
          This page doesn&apos;t exist any more — it may have been deleted.
        </p>
        <Link
          href="/dashboard/pages"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          Back to pages
        </Link>
      </div>
    );
  }

  return (
    <EditorShell
      title={page.label}
      description={
        page.isHome
          ? "Your home page — published at the site root."
          : `Published at /${page.slug}`
      }
      previewPageId={page.id}
    >
      <PageBlocksEditor page={page} />
    </EditorShell>
  );
}
