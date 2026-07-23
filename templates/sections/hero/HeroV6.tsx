"use client";

import { motion } from "framer-motion";
import type { HeroSectionProps } from "@/types";

/** HeroV6 — Atelier: split editorial hero with an offset-framed portrait image. */
export default function HeroV6({ data }: HeroSectionProps) {
  return (
    <section className="overflow-hidden px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {data.subtitle && (
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--site-accent)]">
              <span className="inline-block h-px w-10 bg-[var(--site-accent)]" aria-hidden />
              {data.subtitle}
            </p>
          )}
          <h1 className="text-4xl leading-[1.1] [font-family:var(--site-font-heading)] md:text-6xl">
            {data.title}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[color:var(--site-foreground)]/70">
            {data.description}
          </p>
          {data.buttonText && (
            <a
              href={data.buttonLink || "#"}
              className="mt-10 inline-block border border-[color:var(--site-primary)] bg-[var(--site-primary)] px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--site-background)] transition hover:bg-transparent hover:text-[color:var(--site-primary)]"
            >
              {data.buttonText}
            </a>
          )}
        </motion.div>

        {data.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            {/* Offset keyline frame behind the image */}
            <div
              className="absolute -left-4 -top-4 h-full w-full border border-[color:var(--site-accent)]"
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
      </div>
    </section>
  );
}
