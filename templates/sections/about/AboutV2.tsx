"use client";

import { motion } from "framer-motion";
import type { AboutSectionProps } from "@/types";

/** AboutV2 — Meridian: image left, text right with an accent rule. Corporate. */
export default function AboutV2({ data }: AboutSectionProps) {
  return (
    <section className="bg-[var(--site-muted)] px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        {data.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={data.image}
            alt={data.title}
            className="aspect-[4/3] w-full rounded-[var(--site-radius)] object-cover shadow-lg"
          />
        )}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-5 h-1 w-16 bg-[var(--site-accent)]" />
          <h2 className="text-3xl font-bold [font-family:var(--site-font-heading)] md:text-4xl">
            {data.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[color:var(--site-foreground)]/75">
            {data.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
