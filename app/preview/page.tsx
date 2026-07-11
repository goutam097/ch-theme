"use client";

import { TemplateRenderer } from "@/templates/registry/TemplateRenderer";
import { useActiveTemplate, useSiteContent } from "@/hooks/useSite";
import { useHydrated } from "@/hooks/useHydrated";

/**
 * Standalone, full-bleed preview of the current draft. It reads the same Redux
 * state (hydrated from localStorage) as the dashboard, so opening it in a new
 * tab shows exactly what the editor shows — and exactly what will be published.
 *
 * The persisted content only exists on the client, so we render nothing until
 * hydration completes — this keeps the server HTML and the first client render
 * identical (no hydration mismatch).
 */
export default function StandalonePreviewPage() {
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

  return <TemplateRenderer key={template.id} templateId={template.id} content={content} />;
}
