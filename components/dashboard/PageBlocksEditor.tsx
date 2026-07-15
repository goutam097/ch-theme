"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import {
  addBlock,
  moveBlock,
  removeBlock,
  updateBlock,
  updatePage,
} from "@/store/slices/websiteSlice";
import { HeroEditor } from "@/components/editors/HeroEditor";
import { AboutEditor } from "@/components/editors/AboutEditor";
import { ServicesEditor } from "@/components/editors/ServicesEditor";
import { GalleryEditor } from "@/components/editors/GalleryEditor";
import { ContactEditor } from "@/components/editors/ContactEditor";
import { ApiSectionEditor } from "@/components/editors/ApiSectionEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { BLOCK_LABELS, BLOCK_TYPES } from "@/types";
import type {
  AboutData,
  ApiSectionData,
  BlockType,
  ContactData,
  GalleryItem,
  HeroData,
  PageBlock,
  ServiceItem,
  SitePage,
} from "@/types";

/**
 * The content editor for ONE page: its URL/menu settings, then its stack of
 * blocks. This is the "user can add content" surface — every block the user
 * appends here becomes a real section on that page, rendered by whichever
 * variant the active template picked for that block type.
 */
export function PageBlocksEditor({ page }: { page: SitePage }) {
  const dispatch = useAppDispatch();
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-6">
      {/* --- Page settings (menu label, URL, visibility) -------------------- */}
      <section className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-xs font-medium text-zinc-500">Page settings</p>

        <Field label="Menu label" hint="The text shown in your site's navigation.">
          <Input
            value={page.label}
            onChange={(e) =>
              dispatch(updatePage({ pageId: page.id, patch: { label: e.target.value } }))
            }
          />
        </Field>

        {/* The home page always lives at "/", so its slug isn't editable. */}
        {!page.isHome && (
          <Field
            label="URL"
            hint={`This page is published at /${page.slug}`}
          >
            <Input
              value={page.slug}
              onChange={(e) =>
                dispatch(updatePage({ pageId: page.id, patch: { slug: e.target.value } }))
              }
              placeholder="about"
            />
          </Field>
        )}

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={page.showInMenu}
            onChange={(e) =>
              dispatch(
                updatePage({ pageId: page.id, patch: { showInMenu: e.target.checked } }),
              )
            }
            className="h-4 w-4 rounded border-zinc-300"
          />
          Show this page in the navigation menu
        </label>
      </section>

      {/* --- The blocks ----------------------------------------------------- */}
      <section className="space-y-3">
        <p className="text-xs font-medium text-zinc-500">
          Content blocks — they render top to bottom, in this order
        </p>

        {page.blocks.length === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-400">
            This page is empty. Add a block below to put something on it.
          </p>
        )}

        {page.blocks.map((block, index) => (
          <BlockCard
            key={block.id}
            block={block}
            index={index}
            total={page.blocks.length}
            onMove={(to) => dispatch(moveBlock({ pageId: page.id, from: index, to }))}
            onRemove={() => dispatch(removeBlock({ pageId: page.id, blockId: block.id }))}
            onChange={(data) =>
              dispatch(updateBlock({ pageId: page.id, blockId: block.id, data }))
            }
          />
        ))}
      </section>

      {/* --- Add a block ----------------------------------------------------- */}
      <section>
        {adding ? (
          <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-3">
            <p className="text-xs font-medium text-zinc-500">Add a block</p>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    dispatch(addBlock({ pageId: page.id, type }));
                    setAdding(false);
                  }}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {BLOCK_LABELS[type]}
                </button>
              ))}
            </div>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button type="button" variant="outline" className="w-full" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> Add content block
          </Button>
        )}
      </section>
    </div>
  );
}

/** One collapsible block: header with reorder/remove, body with the block's editor. */
function BlockCard({
  block,
  index,
  total,
  onMove,
  onRemove,
  onChange,
}: {
  block: PageBlock;
  index: number;
  total: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  onChange: (data: PageBlock["data"]) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center gap-1 border-b border-zinc-100 p-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-2 rounded px-1 py-1 text-left text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          aria-expanded={open}
        >
          {open ? (
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-zinc-400" />
          )}
          {BLOCK_LABELS[block.type]}
        </button>

        <button
          type="button"
          aria-label="Move block up"
          disabled={index === 0}
          onClick={() => onMove(index - 1)}
          className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Move block down"
          disabled={index === total - 1}
          onClick={() => onMove(index + 1)}
          className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Remove ${BLOCK_LABELS[block.type]} block`}
          onClick={() => {
            if (confirm(`Remove this ${BLOCK_LABELS[block.type]} block from the page?`)) {
              onRemove();
            }
          }}
          className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {open && (
        <div className="p-4">
          <BlockFields block={block} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

/**
 * Render the editor for this block's type.
 *
 * Switching on `block.type` narrows `block.data` to the matching shape (that's
 * the discriminated union in `types/content.ts` doing its job), so each editor
 * gets exactly the data it expects with no casting.
 */
function BlockFields({
  block,
  onChange,
}: {
  block: PageBlock;
  onChange: (data: PageBlock["data"]) => void;
}) {
  switch (block.type) {
    case "hero":
      return (
        <HeroEditor data={block.data} onChange={(d: HeroData) => onChange(d)} />
      );
    case "about":
      return (
        <AboutEditor data={block.data} onChange={(d: AboutData) => onChange(d)} />
      );
    case "services":
      return (
        <ServicesEditor data={block.data} onChange={(d: ServiceItem[]) => onChange(d)} />
      );
    case "gallery":
      return (
        <GalleryEditor data={block.data} onChange={(d: GalleryItem[]) => onChange(d)} />
      );
    case "contact":
      return (
        <ContactEditor data={block.data} onChange={(d: ContactData) => onChange(d)} />
      );
    case "event":
    case "group":
    case "video":
    case "podcast":
    case "audio":
      return (
        <ApiSectionEditor
          label={BLOCK_LABELS[block.type]}
          data={block.data}
          onChange={(d: ApiSectionData) => onChange(d)}
        />
      );
    default: {
      // Exhaustiveness check: adding a BlockType without an editor won't compile.
      const _never: never = block;
      void _never;
      return null;
    }
  }
}

/** Re-exported so callers can type a block picker without reaching into types. */
export type { BlockType };
