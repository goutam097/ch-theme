"use client";

import Link from "next/link";
import { Maximize2 } from "lucide-react";
import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { PreviewToolbar } from "@/components/preview/PreviewToolbar";

export default function PreviewPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2.5">
        <span className="text-sm font-medium text-zinc-700">Preview</span>
        <div className="flex items-center gap-3">
          <PreviewToolbar />
          <Link
            href="/preview"
            target="_blank"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900"
          >
            <Maximize2 className="h-4 w-4" /> Full screen
          </Link>
        </div>
      </div>
      <PreviewCanvas className="flex-1" />
    </div>
  );
}
