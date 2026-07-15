"use client";

import { useRouter } from "next/navigation";
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
 * WHICH PAGE: `pageId` is the page being edited. The preview shows that page,
 * so what you're typing is always what you're looking at.
 *
 * CLICKING THE MENU: the preview isn't mounted at the site's own URL, so a real
 * navigation would throw the user out of the dashboard. Instead a menu click
 * opens that page's editor — clicking "About" in the preview takes you to the
 * About page's content, preview and all. (That's the `onNavigate` prop; passing
 * it also puts the header variants into preview link mode.)
 *
 * HYDRATION: the store hydrates from localStorage only on the client, so the
 * persisted content/template/device differ from the server's initial defaults.
 * We render a stable placeholder until hydration completes, so the server HTML
 * and the first client render match, then swap in the real preview.
 */
export function PreviewCanvas({
  className,
  pageId,
}: {
  className?: string;
  /** The page to show. Defaults to the site's home page. */
  pageId?: string;
}) {
  const router = useRouter();
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
          <TemplateRenderer
            key={template.id}
            templateId={template.id}
            content={content}
            pageId={pageId}
            onNavigate={(id) => router.push(`/dashboard/pages/${id}`)}
          />
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-400">
            Loading preview…
          </div>
        )}
      </div>
    </div>
  );
}
