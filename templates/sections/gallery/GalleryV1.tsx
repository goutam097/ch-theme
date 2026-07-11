"use client";

import { motion } from "framer-motion";
import type { GallerySectionProps } from "@/types";

/** GalleryV1 — Aurora: even responsive grid with rounded corners. */
export default function GalleryV1({ data }: GallerySectionProps) {
  if (!data.length) return null;
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-center text-3xl font-bold [font-family:var(--site-font-heading)] md:text-4xl">
          Gallery
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {data.map((item, i) => (
            <motion.div
              key={`${item.image}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="overflow-hidden rounded-[var(--site-radius)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                className="aspect-square w-full object-cover transition duration-500 hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
