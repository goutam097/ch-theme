"use client";

import { motion } from "framer-motion";
import type { GallerySectionProps } from "@/types";

/** GalleryV3 — Noir: large two-column plates with index labels. */
export default function GalleryV3({ data }: GallerySectionProps) {
  if (!data.length) return null;
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--site-secondary)]">
          Portfolio
        </h2>
        <div className="grid gap-10 sm:grid-cols-2">
          {data.map((item, i) => (
            <motion.figure
              key={`${item.image}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="aspect-[4/5] w-full object-cover grayscale transition duration-500 hover:grayscale-0" />
              <figcaption className="mt-3 font-mono text-xs text-[color:var(--site-foreground)]/50">
                FIG. {String(i + 1).padStart(2, "0")}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
