"use client";

import { motion } from "framer-motion";
import type { AboutSectionProps } from "@/types";

/** AboutV1 — Aurora: text left, rounded image right. */
export default function AboutV1({ data }: AboutSectionProps) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight [font-family:var(--site-font-heading)] md:text-4xl">
            {data.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[color:var(--site-foreground)]/70">
            {data.description}
          </p>
        </motion.div>
        {data.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={data.image}
            alt={data.title}
            className="aspect-square w-full rounded-[var(--site-radius)] object-cover shadow-xl"
          />
        )}
      </div>
    </section>
  );
}
