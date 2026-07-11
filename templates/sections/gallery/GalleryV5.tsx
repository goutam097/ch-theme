"use client";

import { motion } from "framer-motion";
import type { GallerySectionProps } from "@/types";

/** GalleryV5 - Bloom: playful staggered grid where some tiles span larger. */
export default function GalleryV5({ data }: GallerySectionProps) {
  if (!data.length) return null;
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-center text-3xl font-bold [font-family:var(--site-font-heading)] md:text-4xl">
          <span className="bg-linear-to-r from-[var(--site-primary)] to-[var(--site-accent)] bg-clip-text text-transparent">
            Moments
          </span>
        </h2>
        <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4">
          {data.map((item, i) => (
            <motion.div
              key={`${item.image}-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`overflow-hidden rounded-[var(--site-radius)] shadow-md ${
                i % 5 === 0 ? "row-span-2 col-span-2" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-110" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
