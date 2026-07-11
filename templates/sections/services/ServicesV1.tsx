"use client";

import { motion } from "framer-motion";
import type { ServicesSectionProps } from "@/types";

/** ServicesV1 — Aurora: 3-up cards with image header. */
export default function ServicesV1({ data }: ServicesSectionProps) {
  return (
    <section className="bg-[var(--site-muted)] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold tracking-tight [font-family:var(--site-font-heading)] md:text-4xl">
          What we do
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item, i) => (
            <motion.article
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="overflow-hidden rounded-[var(--site-radius)] bg-[var(--site-background)] shadow-sm transition hover:shadow-lg"
            >
              {item.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-[color:var(--site-foreground)]/70">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
