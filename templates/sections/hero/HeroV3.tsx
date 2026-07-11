"use client";

import { motion } from "framer-motion";
import type { HeroSectionProps } from "@/types";

/** HeroV3 — Noir: text-only, oversized editorial typography. Ignores image/video. */
export default function HeroV3({ data }: HeroSectionProps) {
  return (
    <section className="border-b-2 border-[color:var(--site-foreground)] px-6 py-28 md:py-40">
      <div className="mx-auto max-w-5xl">
        {data.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--site-secondary)]"
          >
            {data.subtitle}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold leading-[0.95] tracking-tight [font-family:var(--site-font-heading)] md:text-8xl"
        >
          {data.title}
        </motion.h1>
        <div className="mt-10 max-w-2xl border-l-4 border-[color:var(--site-accent)] pl-6">
          <p className="text-xl leading-relaxed text-[color:var(--site-foreground)]/75">
            {data.description}
          </p>
        </div>
        {data.buttonText && (
          <a
            href={data.buttonLink || "#"}
            className="mt-10 inline-flex items-center gap-2 border-b-2 border-[color:var(--site-foreground)] pb-1 text-lg font-semibold transition hover:gap-4"
          >
            {data.buttonText} →
          </a>
        )}
      </div>
    </section>
  );
}
