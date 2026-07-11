"use client";

import { motion } from "framer-motion";
import type { AboutSectionProps } from "@/types";

/** AboutV5 - Bloom: playful offset card with a gradient frame around the image. */
export default function AboutV5({ data }: AboutSectionProps) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        {data.image && (
          <motion.div
            initial={{ opacity: 0, rotate: -3, scale: 0.95 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[var(--site-radius)] bg-linear-to-br from-[var(--site-primary)] to-[var(--site-accent)] p-2 shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image}
              alt={data.title}
              className="aspect-square w-full rounded-[calc(var(--site-radius)-0.25rem)] object-cover"
            />
          </motion.div>
        )}
        <div>
          <h2 className="text-3xl font-bold tracking-tight [font-family:var(--site-font-heading)] md:text-4xl">
            <span className="bg-linear-to-r from-[var(--site-primary)] to-[var(--site-accent)] bg-clip-text text-transparent">
              {data.title}
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[color:var(--site-foreground)]/75">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}
