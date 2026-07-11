"use client";

import { motion } from "framer-motion";
import type { ServicesSectionProps } from "@/types";

/** ServicesV4 - Pulse: dark cards with accent glow on hover. */
export default function ServicesV4({ data }: ServicesSectionProps) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold [font-family:var(--site-font-heading)] md:text-4xl">
          Capabilities
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item, i) => (
            <motion.article
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative rounded-[var(--site-radius)] border border-white/10 bg-[var(--site-muted)] p-7 transition hover:border-[var(--site-accent)]"
            >
              <div className="absolute -inset-px -z-10 rounded-[var(--site-radius)] bg-linear-to-br from-[var(--site-primary)]/0 to-[var(--site-accent)]/0 opacity-0 blur transition group-hover:opacity-30" />
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--site-primary)] font-bold text-black">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-[color:var(--site-foreground)]/70">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
