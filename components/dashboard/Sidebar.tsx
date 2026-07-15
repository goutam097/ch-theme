"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EyeOff, FileText, Home, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_GROUPS, NAV_ITEMS } from "./nav-items";
import { useActiveTemplate, usePages } from "@/hooks/useSite";
import { useHydrated } from "@/hooks/useHydrated";

export function Sidebar() {
  const pathname = usePathname();
  const template = useActiveTemplate();
  const pages = usePages();
  const hydrated = useHydrated();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white md:flex">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-semibold text-zinc-900">SiteForge</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group}>
            <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {group}
            </p>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-zinc-600 hover:bg-zinc-100",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}

              {/*
                The user's pages, listed under Content. This is the dashboard
                mirror of the site's own menu: it grows and reorders with the
                pages, because it's rendered straight from them.

                Rendered only after hydration — pages live in localStorage, so
                the server has no idea what they are.
              */}
              {group === "Content" && hydrated && (
                <div className="mt-1 space-y-0.5 border-l border-zinc-100 pl-3">
                  {pages.map((page) => {
                    const href = `/dashboard/pages/${page.id}`;
                    const active = pathname === href;
                    return (
                      <Link
                        key={page.id}
                        href={href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-indigo-50 font-medium text-indigo-700"
                            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800",
                        )}
                      >
                        {page.isHome ? (
                          <Home className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span className="truncate">{page.label}</span>
                        {/* Hidden from the site's menu, but still editable here. */}
                        {!page.showInMenu && (
                          <EyeOff
                            className="ml-auto h-3 w-3 shrink-0 text-zinc-300"
                            aria-label="Hidden from menu"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-zinc-200 px-4 py-4">
        <p className="text-xs text-zinc-400">Active template</p>
        <p className="text-sm font-medium text-zinc-900">{template.name}</p>
      </div>
    </aside>
  );
}
