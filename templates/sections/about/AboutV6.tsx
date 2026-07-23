"use client";

import { motion } from "framer-motion";
import type { AboutSectionProps } from "@/types";

/** AboutV6 — Atelier: framed image beside an editorial text column. */
export default function AboutV6({ data }: AboutSectionProps) {
  return (
    <section className="bg-[var(--site-muted)] px-6 py-24 md:py-32">
      <div
        className={
          data.image
            ? "mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2"
            : "mx-auto max-w-3xl text-center"
        }
      >
        {data.image && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Offset keyline frame behind the image */}
            <div
              className="absolute -bottom-4 -right-4 h-full w-full border border-[color:var(--site-accent)]"
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image}
              alt={data.title}
              className="relative aspect-[4/5] w-full object-cover"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--site-accent)]">
            About
          </p>
          <h2 className="text-3xl leading-tight [font-family:var(--site-font-heading)] md:text-5xl">
            {data.title}
          </h2>
          <span className="mt-6 inline-block h-px w-16 bg-[var(--site-accent)]" aria-hidden />
          <p className="mt-6 text-lg leading-relaxed text-[color:var(--site-foreground)]/75">
            {data.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
