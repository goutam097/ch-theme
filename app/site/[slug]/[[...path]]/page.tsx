"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { TemplateRenderer } from "@/templates/registry/TemplateRenderer";
import { fetchSiteTheme } from "@/lib/site-api";
import type { SiteSnapshot } from "@/lib/site-theme";

/**
 * Public, published website — every page of it.
 *
 *   /site/acme          → the site's home page
 *   /site/acme/about    → the page whose slug is "about"
 *   /site/acme/pricing  → a page the user created themselves
 *
 * This is an OPTIONAL catch-all (`[[...path]]`), which matches both the bare
 * `/site/<slug>` and any single page segment beneath it. That's what lets one
 * route serve a menu the user can grow at runtime — there's no per-page route
 * to add when they create a page. (It also means there must be no sibling
 * `page.tsx` at `/site/[slug]`: an optional catch-all already matches that path,
 * and two routes of equal specificity is a build error.)
 *
 * Fetches the published snapshot ({templateId, content, settings}) for `slug`
 * and renders it with the SAME <TemplateRenderer/> the dashboard preview uses,
 * so output is pixel-identical everywhere.
 *
 * This is a Client Component because the section variants it renders rely on
 * client-only hooks (framer-motion, useState, …).
 */
export default function PublicSitePage({
  params,
}: {
  params: Promise<{ slug: string; path?: string[] }>;
}) {
  const { slug, path } = use(params);
  const [state, setState] = useState<
    { status: "loading" } | { status: "ready"; snapshot: SiteSnapshot | null }
  >({ status: "loading" });

  useEffect(() => {
    let active = true;
    fetchSiteTheme(slug)
      .then((snapshot) => active && setState({ status: "ready", snapshot }))
      .catch(() => active && setState({ status: "ready", snapshot: null }));
    return () => {
      active = false;
    };
  }, [slug]);

  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  const { snapshot } = state;
  const isLive = snapshot?.settings.status === "published";

  if (!snapshot || !isLive) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">
          {snapshot ? "This site isn't published yet" : "Site not found"}
        </h1>
        <p className="max-w-md text-zinc-500">
          {snapshot
            ? "Head back to the dashboard and hit Publish to make this site live."
            : `No published site exists at /site/${slug}.`}
        </p>
        <Link href="/dashboard" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <TemplateRenderer
      templateId={snapshot.templateId}
      content={snapshot.content}
      // `path` selects the page; `basePath` makes every menu link resolve to
      // /site/<slug>/… rather than the app root.
      segments={path}
      basePath={`/site/${slug}`}
    />
  );
}
