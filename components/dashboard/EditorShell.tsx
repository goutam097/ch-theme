"use client";

import type { ReactNode } from "react";
import { PreviewToolbar } from "@/components/preview/PreviewToolbar";
import { PreviewCanvas } from "@/components/preview/PreviewCanvas";

interface EditorShellProps {
  title: string;
  description: string;
  children: ReactNode;
  /** Which page the preview should show. Defaults to the site's home page. */
  previewPageId?: string;
}

/**
 * The split live-preview layout: editor form on the left, instantly-updating
 * website preview on the right. Shared by every editor so the experience is
 * identical regardless of which template variant is active — users never know
 * (or need to know) which variant renders their content.
 */
export function EditorShell({
  title,
  description,
  children,
  previewPageId,
}: EditorShellProps) {
  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Left: editor */}
      <div className="w-full overflow-y-auto border-b border-zinc-200 bg-white p-6 lg:w-[440px] lg:shrink-0 lg:border-b-0 lg:border-r">
        <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
        <div className="mt-6">{children}</div>
      </div>

      {/* Right: live preview */}
      <div className="flex min-h-[60vh] flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2.5">
          <span className="text-sm font-medium text-zinc-500">Live preview</span>
          <PreviewToolbar />
        </div>
        <PreviewCanvas className="flex-1" pageId={previewPageId} />
      </div>
    </div>
  );
}
