"use client";

import { motion } from "framer-motion";
import type { ContactSectionProps } from "@/types";

/** ContactV6 — Atelier: deep-toned enquiry panel with an optional map. */
export default function ContactV6({ data }: ContactSectionProps) {
  return (
    <section id="contact" className="px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl overflow-hidden border border-[color:var(--site-foreground)]/10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[var(--site-primary)] p-10 text-[color:var(--site-background)] md:p-16"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--site-accent)]">
            Enquiries
          </p>
          <h2 className="text-3xl leading-tight [font-family:var(--site-font-heading)] md:text-5xl">
            Let&apos;s begin a conversation.
          </h2>
          <div className="mt-10 space-y-6 text-lg">
            <a
              href={`mailto:${data.email}`}
              className="block transition hover:text-[color:var(--site-accent)]"
            >
              {data.email}
            </a>
            <a
              href={`tel:${data.phone}`}
              className="block transition hover:text-[color:var(--site-accent)]"
            >
              {data.phone}
            </a>
            <p className="text-[color:var(--site-background)]/70">{data.address}</p>
          </div>
        </motion.div>

        {data.mapUrl ? (
          <iframe
            title="Map"
            src={data.mapUrl}
            className="h-80 w-full border-0 md:h-full"
            loading="lazy"
          />
        ) : (
          <div className="hidden items-center justify-center bg-[var(--site-muted)] p-16 md:flex">
            <span className="text-8xl text-[color:var(--site-accent)] [font-family:var(--site-font-heading)]">
              &amp;
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
