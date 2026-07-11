"use client";

import { motion } from "framer-motion";
import type { ContactSectionProps } from "@/types";

/** ContactV5 - Bloom: vibrant gradient panel with details and a rounded map. */
export default function ContactV5({ data }: ContactSectionProps) {
  return (
    <section id="contact" className="px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[var(--site-radius)] bg-linear-to-br from-[var(--site-primary)] to-[var(--site-accent)] p-8 text-white shadow-2xl md:grid-cols-2 md:p-12"
      >
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold [font-family:var(--site-font-heading)] md:text-4xl">
            Say hello 
          </h2>
          <div className="mt-6 space-y-3 text-lg">
            <p><a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a></p>
            <p><a href={`tel:${data.phone}`} className="hover:underline">{data.phone}</a></p>
            <p className="text-white/85">{data.address}</p>
          </div>
        </div>
        {data.mapUrl && (
          <iframe
            title="Map"
            src={data.mapUrl}
            className="h-64 w-full rounded-[calc(var(--site-radius)-0.5rem)] border-0 md:h-full"
            loading="lazy"
          />
        )}
      </motion.div>
    </section>
  );
}
