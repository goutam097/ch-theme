"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GallerySectionProps } from "@/types";

/** GalleryV4 — Pulse: dark grid with a click-to-zoom lightbox. */
export default function GalleryV4({ data }: GallerySectionProps) {
  const [active, setActive] = useState<string | null>(null);
  if (!data.length) return null;

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-bold [font-family:var(--site-font-heading)] md:text-4xl">
          Showreel
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {data.map((item, i) => (
            <button
              key={`${item.image}-${i}`}
              onClick={() => setActive(item.image)}
              className="group relative overflow-hidden rounded-[var(--site-radius)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110" />
              <span className="absolute inset-0 bg-[var(--site-primary)]/0 transition group-hover:bg-[var(--site-primary)]/20" />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={active}
              alt=""
              className="max-h-[85vh] max-w-full rounded-[var(--site-radius)] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
