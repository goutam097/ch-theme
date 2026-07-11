"use client";

import { motion } from "framer-motion";
import type { ContactSectionProps } from "@/types";

/** ContactV4 — Pulse: dark glass contact card floated over the map. */
export default function ContactV4({ data }: ContactSectionProps) {
  return (
    <section id="contact" className="relative px-6 py-20 md:py-28">
      {data.mapUrl && (
        <iframe
          title="Map"
          src={data.mapUrl}
          className="absolute inset-0 h-full w-full border-0 opacity-25 grayscale invert"
          loading="lazy"
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-xl rounded-[var(--site-radius)] border border-white/10 bg-[var(--site-muted)]/90 p-10 backdrop-blur"
      >
        <h2 className="text-3xl font-bold text-[color:var(--site-accent)] [font-family:var(--site-font-heading)]">
          Start a project
        </h2>
        <div className="mt-6 space-y-3 text-lg">
          <p><span className="text-[color:var(--site-foreground)]/50">Email </span><a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a></p>
          <p><span className="text-[color:var(--site-foreground)]/50">Phone </span><a href={`tel:${data.phone}`} className="hover:underline">{data.phone}</a></p>
          <p><span className="text-[color:var(--site-foreground)]/50">Studio </span>{data.address}</p>
        </div>
      </motion.div>
    </section>
  );
}
