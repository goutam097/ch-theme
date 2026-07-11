"use client";

import { useSettings } from "@/hooks/useSite";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";
import { PublishButton } from "./PublishButton";

export function DashboardHeader() {
  const settings = useSettings();
  // Persisted state loads only on the client; keep the "draft" appearance until
  // hydrated so the server and first client render match (no hydration error).
  const hydrated = useHydrated();
  const published = hydrated && settings.status === "published";

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <span className="font-medium text-zinc-900" suppressHydrationWarning>
          {settings.siteName}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
            published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", published ? "bg-green-500" : "bg-amber-500")} />
          {published ? "Published" : "Draft"}
        </span>
      </div>
      <PublishButton />
    </header>
  );
}
