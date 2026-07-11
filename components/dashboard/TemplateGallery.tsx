"use client";

import { Check } from "lucide-react";
import { templateList } from "@/templates/registry/templateRegistry";
import { useAppDispatch } from "@/store/hooks";
import { setTemplate } from "@/store/slices/templateSlice";
import { useActiveTemplate } from "@/hooks/useSite";
import { cn } from "@/lib/utils";

/**
 * Template picker. Selecting a template only dispatches `setTemplate(id)` — the
 * content slice is never touched, so switching Aurora → Pulse keeps every word
 * and image the user has entered. This is the payoff of the shared data model.
 */
export function TemplateGallery() {
  const active = useActiveTemplate();
  const dispatch = useAppDispatch();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {templateList.map((tpl) => {
        const selected = tpl.id === active.id;
        return (
          <button
            key={tpl.id}
            onClick={() => dispatch(setTemplate(tpl.id))}
            className={cn(
              "group overflow-hidden rounded-xl border-2 bg-white text-left transition",
              selected ? "border-indigo-600 shadow-lg" : "border-transparent hover:border-zinc-200 hover:shadow-md",
            )}
          >
            <div className="relative aspect-video overflow-hidden bg-zinc-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tpl.thumbnail}
                alt={tpl.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              {selected && (
                <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900">{tpl.name}</h3>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                  {tpl.category}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500">{tpl.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
