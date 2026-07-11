"use client";

import { motion } from "framer-motion";
import type { AboutSectionProps } from "@/types";

/** AboutV4 — Pulse: dark full-width image with text overlaid in a card. */
export default function AboutV4({ data }: AboutSectionProps) {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      {data.image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={data.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div className="relative mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[var(--site-radius)] border border-white/10 bg-[var(--site-muted)]/80 p-10 backdrop-blur"
        >
          <h2 className="text-3xl font-bold text-[color:var(--site-accent)] [font-family:var(--site-font-heading)] md:text-4xl">
            {data.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[color:var(--site-foreground)]/80">
            {data.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
