"use client";

import { motion } from "framer-motion";
import type { GallerySectionProps } from "@/types";

/** GalleryV6 — Atelier: masonry of matted, gallery-framed images. */
export default function GalleryV6({ data }: GallerySectionProps) {
  if (!data.length) return null;
  return (
    <section className="bg-[var(--site-muted)] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--site-accent)]">
            Portfolio
          </p>
          <h2 className="text-3xl [font-family:var(--site-font-heading)] md:text-5xl">
            Selected work
          </h2>
        </div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {data.map((item, i) => (
            <motion.figure
              key={`${item.image}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mb-6 break-inside-avoid border border-[color:var(--site-foreground)]/10 bg-[var(--site-background)] p-3"
            >
              <div className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt=""
                  className="w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <figcaption className="pt-3 text-center text-[10px] uppercase tracking-[0.3em] text-[color:var(--site-foreground)]/45">
                No. {String(i + 1).padStart(2, "0")}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
