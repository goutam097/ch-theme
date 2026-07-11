"use client";

import { motion } from "framer-motion";
import type { ServicesSectionProps } from "@/types";

/** ServicesV5 - Bloom: colorful rounded cards with gradient top border. */
const GRADIENTS = [
  "from-pink-500 to-rose-400",
  "from-violet-500 to-fuchsia-400",
  "from-teal-500 to-emerald-400",
  "from-amber-500 to-orange-400",
];

export default function ServicesV5({ data }: ServicesSectionProps) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold [font-family:var(--site-font-heading)] md:text-4xl">
          How we help
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item, i) => (
            <motion.article
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-[var(--site-radius)] bg-[var(--site-background)] shadow-lg"
            >
              <div className={`h-2 bg-linear-to-r ${GRADIENTS[i % GRADIENTS.length]}`} />
              <div className="p-6">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--site-foreground)]/70">
                  {item.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
