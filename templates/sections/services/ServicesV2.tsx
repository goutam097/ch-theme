"use client";

import { motion } from "framer-motion";
import type { ServicesSectionProps } from "@/types";

/** ServicesV2 — Meridian: alternating image/text rows. Corporate, detailed. */
export default function ServicesV2({ data }: ServicesSectionProps) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-14 text-3xl font-bold [font-family:var(--site-font-heading)] md:text-4xl">
          Our services
        </h2>
        <div className="space-y-14">
          {data.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className={`grid items-center gap-8 md:grid-cols-2 ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              {item.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.image}
                  alt={item.title}
                  className="aspect-video w-full rounded-[var(--site-radius)] object-cover [direction:ltr]"
                />
              )}
              <div className="[direction:ltr]">
                <span className="text-sm font-bold text-[color:var(--site-accent)]">
                  0{i + 1}
                </span>
                <h3 className="mt-1 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-[color:var(--site-foreground)]/75">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
