"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  FileText,
  Home,
  Plus,
  Trash2,
} from "lucide-react";
import { usePages } from "@/hooks/useSite";
import { useAppDispatch } from "@/store/hooks";
import { useHydrated } from "@/hooks/useHydrated";
import {
  addPage,
  removePage,
  reorderPages,
  updatePage,
} from "@/store/slices/websiteSlice";
import { slugify } from "@/lib/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

/**
 * PAGES — the dynamic menu.
 *
 * There is no separate "menu editor" anywhere in the app, on purpose: the menu
 * IS this list. Every page here with the eye toggled on becomes a nav link on
 * the live site, in this order, on every template. Add "Pricing" and a Pricing
 * link appears; drag it above About and it moves in the menu too.
 */
export default function PagesManagerPage() {
  const hydrated = useHydrated();
  const pages = usePages();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [newLabel, setNewLabel] = useState("");

  function handleAdd() {
    const label = newLabel.trim();
    if (!label) return;
    dispatch(addPage({ label }));
    setNewLabel("");
  }

  // The store only holds real content after localStorage hydration; render a
  // placeholder until then so the server and first client render agree.
  if (!hydrated) {
    return (
      <div className="p-6 text-sm text-zinc-400">Loading pages…</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Pages</h1>
        <p className="mt-1 text-zinc-500">
          Every page here is a menu item on your website. Add a page and it shows
          up in the navigation — reorder them to reorder the menu.
        </p>
      </div>

      {/* --- Add a page ---------------------------------------------------- */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex items-end gap-3">
          <Field
            label="New page"
            className="flex-1"
            hint={
              newLabel.trim()
                ? `Will be published at /${slugify(newLabel) || "page"}`
                : "e.g. Pricing, Blog, Our Team"
            }
          >
            <Input
              value={newLabel}
              placeholder="Page name"
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </Field>
          <Button type="button" onClick={handleAdd} disabled={!newLabel.trim()} className="mb-1">
            <Plus className="h-4 w-4" /> Add page
          </Button>
        </div>
      </div>

      {/* --- The pages / the menu ------------------------------------------ */}
      <div className="space-y-2">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3"
          >
            {/* Reorder — this is the menu order too. */}
            <div className="flex flex-col">
              <button
                type="button"
                aria-label="Move up"
                disabled={index === 0}
                onClick={() => dispatch(reorderPages({ from: index, to: index - 1 }))}
                className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={index === pages.length - 1}
                onClick={() => dispatch(reorderPages({ from: index, to: index + 1 }))}
                className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
              {page.isHome ? <Home className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            </div>

            {/* Rename — the label is what shows in the menu. */}
            <div className="min-w-0 flex-1">
              <Input
                value={page.label}
                aria-label={`Menu label for ${page.label}`}
                onChange={(e) =>
                  dispatch(
                    updatePage({ pageId: page.id, patch: { label: e.target.value } }),
                  )
                }
                className="h-8 border-transparent px-2 font-medium shadow-none hover:border-zinc-200 focus:border-zinc-300"
              />
              <p className="mt-0.5 px-2 text-xs text-zinc-400">
                {page.isHome ? "/ (home)" : `/${page.slug}`} ·{" "}
                {page.blocks.length}{" "}
                {page.blocks.length === 1 ? "block" : "blocks"}
              </p>
            </div>

            {/* Show in menu */}
            <button
              type="button"
              onClick={() =>
                dispatch(
                  updatePage({
                    pageId: page.id,
                    patch: { showInMenu: !page.showInMenu },
                  }),
                )
              }
              title={page.showInMenu ? "Shown in menu — click to hide" : "Hidden from menu — click to show"}
              aria-label={page.showInMenu ? "Hide from menu" : "Show in menu"}
              className={`rounded-lg p-2 transition-colors ${
                page.showInMenu
                  ? "text-indigo-600 hover:bg-indigo-50"
                  : "text-zinc-300 hover:bg-zinc-100"
              }`}
            >
              {page.showInMenu ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/pages/${page.id}`)}
            >
              Edit content
            </Button>

            {/* Home is never deletable — the site must always have a page at "/". */}
            <button
              type="button"
              disabled={page.isHome}
              onClick={() => {
                if (confirm(`Delete the "${page.label}" page and everything on it?`)) {
                  dispatch(removePage(page.id));
                }
              }}
              aria-label={`Delete ${page.label}`}
              title={page.isHome ? "The home page can't be deleted" : `Delete ${page.label}`}
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <p className="text-sm text-zinc-500">
        Want to see it as a visitor would?{" "}
        <Link href="/preview" className="font-medium text-indigo-600 hover:underline">
          Open the full preview
        </Link>{" "}
        and click through the menu.
      </p>
    </div>
  );
}
