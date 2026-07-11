"use client";

import { Monitor, Tablet, Smartphone } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPreviewDevice } from "@/store/slices/settingsSlice";
import { cn } from "@/lib/utils";
import type { PreviewDevice } from "@/types";

const DEVICES: { id: PreviewDevice; icon: typeof Monitor; label: string }[] = [
  { id: "desktop", icon: Monitor, label: "Desktop" },
  { id: "tablet", icon: Tablet, label: "Tablet" },
  { id: "mobile", icon: Smartphone, label: "Mobile" },
];

/**
 * Device switcher for the live preview. `previewDevice` starts at the SSR-safe
 * default ("desktop") on both the server and the first client render, so this
 * renders identically on both — no hydration mismatch. It only changes in
 * response to a user click (after hydration).
 */
export function PreviewToolbar() {
  const device = useAppSelector((s) => s.settings.previewDevice);
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1">
      {DEVICES.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => dispatch(setPreviewDevice(id))}
          aria-pressed={device === id}
          title={label}
          className={cn(
            "flex h-8 w-9 items-center justify-center rounded-md transition-colors",
            device === id
              ? "bg-indigo-600 text-white"
              : "text-zinc-500 hover:bg-zinc-100",
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
