"use client";

import type { GallerySectionProps } from "@/types";

/** GalleryV2 — Meridian: masonry-style columns (CSS columns). */
export default function GalleryV2({ data }: GallerySectionProps) {
  if (!data.length) return null;
  return (
    <section className="bg-[var(--site-muted)] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-bold [font-family:var(--site-font-heading)] md:text-4xl">
          Selected work
        </h2>
        <div className="columns-2 gap-4 md:columns-3">
          {data.map((item, i) => (
            <div
              key={`${item.image}-${i}`}
              className="mb-4 break-inside-avoid overflow-hidden rounded-[var(--site-radius)] shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                className={`w-full object-cover ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
