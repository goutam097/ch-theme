"use client";

import { motion } from "framer-motion";
import type { AboutSectionProps } from "@/types";

/** AboutV3 — Noir: centered editorial statement, no image. */
export default function AboutV3({ data }: AboutSectionProps) {
  return (
    <section className="px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--site-secondary)]">
          {data.title}
        </p>
        <p className="text-2xl font-medium leading-snug [font-family:var(--site-font-heading)] md:text-4xl">
          {data.description}
        </p>
      </motion.div>
    </section>
  );
}
