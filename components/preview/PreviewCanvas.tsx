"use client";

import { useSiteContent, useActiveTemplate, useSettings } from "@/hooks/useSite";
import { useHydrated } from "@/hooks/useHydrated";
import { TemplateRenderer } from "@/templates/registry/TemplateRenderer";
import { cn } from "@/lib/utils";
import type { PreviewDevice } from "@/types";

const DEVICE_WIDTH: Record<PreviewDevice, string> = {
  desktop: "w-full",
  tablet: "w-[768px] max-w-full",
  mobile: "w-[390px] max-w-full",
};

/**
 * Renders the live website from current Redux state inside a device-sized
 * frame. Because it reads the store directly, every keystroke in an editor is
 * reflected here instantly — this is the "right side" of the split preview.
 *
 * HYDRATION: the store hydrates from localStorage only on the client, so the
 * persisted content/template/device differ from the server's initial defaults.
 * We render a stable placeholder until hydration completes, so the server HTML
 * and the first client render match, then swap in the real preview.
 */
export function PreviewCanvas({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const content = useSiteContent();
  const template = useActiveTemplate();
  const { previewDevice } = useSettings();

  // Before hydration, use the SSR-safe default width so the outer frame is
  // identical on the server and the first client render.
  const device: PreviewDevice = hydrated ? previewDevice : "desktop";

  return (
    <div className={cn("flex justify-center overflow-y-auto bg-zinc-100 p-4", className)}>
      <div
        className={cn(
          "h-fit overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-300",
          DEVICE_WIDTH[device] ?? DEVICE_WIDTH.desktop,
        )}
      >
        {hydrated ? (
          // key forces a clean remount on template switch so entrance animations replay
          <TemplateRenderer key={template.id} templateId={template.id} content={content} />
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-400">
            Loading preview…
          </div>
        )}
      </div>
    </div>
  );
}
