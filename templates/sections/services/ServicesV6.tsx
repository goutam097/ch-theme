"use client";

import { motion } from "framer-motion";
import type { ServicesSectionProps } from "@/types";

/** ServicesV6 — Atelier: hairline-ruled grid of numbered service cells. */
export default function ServicesV6({ data }: ServicesSectionProps) {
  if (!data.length) return null;
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--site-accent)]">
            What we do
          </p>
          <h2 className="text-3xl [font-family:var(--site-font-heading)] md:text-5xl">
            Services
          </h2>
        </div>

        {/* 1px gaps over a tinted backdrop draw the hairline rules between cells */}
        <div className="grid gap-px overflow-hidden border border-[color:var(--site-foreground)]/10 bg-[color:var(--site-foreground)]/10 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item, i) => (
            <motion.article
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="bg-[var(--site-background)] p-10 transition hover:bg-[var(--site-muted)]"
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt=""
                  className="mb-6 h-14 w-14 object-cover"
                />
              ) : (
                <span className="mb-6 block text-sm text-[color:var(--site-accent)] [font-family:var(--site-font-heading)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <h3 className="text-xl [font-family:var(--site-font-heading)]">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-[color:var(--site-foreground)]/65">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
