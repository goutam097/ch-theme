"use client";

import { motion } from "framer-motion";
import type { ContactSectionProps } from "@/types";

/** ContactV3 — Noir: minimal large-type contact lines, no map. */
export default function ContactV3({ data }: ContactSectionProps) {
  return (
    <section id="contact" className="border-t-2 border-[color:var(--site-foreground)] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold leading-tight [font-family:var(--site-font-heading)] md:text-6xl"
        >
          Let&apos;s work together.
        </motion.h2>
        <div className="mt-12 space-y-4 text-xl">
          <a href={`mailto:${data.email}`} className="block border-b border-[color:var(--site-foreground)]/20 pb-3 transition hover:text-[color:var(--site-accent)]">
            {data.email}
          </a>
          <a href={`tel:${data.phone}`} className="block border-b border-[color:var(--site-foreground)]/20 pb-3 transition hover:text-[color:var(--site-accent)]">
            {data.phone}
          </a>
          <p className="border-b border-[color:var(--site-foreground)]/20 pb-3 text-[color:var(--site-foreground)]/70">
            {data.address}
          </p>
        </div>
      </div>
    </section>
  );
}
