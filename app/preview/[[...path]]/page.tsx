"use client";

import { use } from "react";
import { TemplateRenderer } from "@/templates/registry/TemplateRenderer";
import { useActiveTemplate, useSiteContent } from "@/hooks/useSite";
import { useHydrated } from "@/hooks/useHydrated";

/**
 * Standalone, full-bleed preview of the current draft — all of its pages.
 *
 *   /preview          → the draft's home page
 *   /preview/about    → the draft's "about" page
 *
 * It reads the same Redux state (hydrated from localStorage) as the dashboard,
 * so opening it in a new tab shows exactly what the editor shows — and exactly
 * what will be published. Menu links navigate for real here (basePath
 * "/preview"), which is the easiest way to click through the site as a visitor
 * would before publishing.
 *
 * The persisted content only exists on the client, so we render nothing until
 * hydration completes — this keeps the server HTML and the first client render
 * identical (no hydration mismatch).
 */
export default function StandalonePreviewPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = use(params);
  const hydrated = useHydrated();
  const content = useSiteContent();
  const template = useActiveTemplate();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-sm text-zinc-400">
        Loading preview…
      </div>
    );
  }

  return (
    <TemplateRenderer
      key={template.id}
      templateId={template.id}
      content={content}
      segments={path}
      basePath="/preview"
    />
  );
}
