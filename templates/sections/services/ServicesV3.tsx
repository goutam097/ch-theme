"use client";

import { motion } from "framer-motion";
import type { ServicesSectionProps } from "@/types";

/** ServicesV3 — Noir: minimal numbered list, typographic, no images. */
export default function ServicesV3({ data }: ServicesSectionProps) {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--site-secondary)]">
          Services
        </h2>
        <div className="divide-y divide-[color:var(--site-foreground)]/15">
          {data.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="group flex flex-col gap-2 py-7 md:flex-row md:items-baseline md:gap-10"
            >
              <span className="font-mono text-sm text-[color:var(--site-foreground)]/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl font-semibold [font-family:var(--site-font-heading)] md:w-1/3">
                {item.title}
              </h3>
              <p className="flex-1 text-[color:var(--site-foreground)]/70">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
