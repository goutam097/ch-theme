"use client";

import { motion } from "framer-motion";
import type { ContactSectionProps } from "@/types";

/** ContactV1 — Aurora: details on the left, embedded map on the right. */
export default function ContactV1({ data }: ContactSectionProps) {
  return (
    <section id="contact" className="bg-[var(--site-muted)] px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight [font-family:var(--site-font-heading)] md:text-4xl">
            Get in touch
          </h2>
          <dl className="mt-8 space-y-5 text-lg">
            <div>
              <dt className="text-sm font-medium text-[color:var(--site-foreground)]/50">Phone</dt>
              <dd>
                <a href={`tel:${data.phone}`} className="hover:text-[color:var(--site-primary)]">{data.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[color:var(--site-foreground)]/50">Email</dt>
              <dd>
                <a href={`mailto:${data.email}`} className="hover:text-[color:var(--site-primary)]">{data.email}</a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[color:var(--site-foreground)]/50">Address</dt>
              <dd>{data.address}</dd>
            </div>
          </dl>
        </motion.div>
        {data.mapUrl && (
          <iframe
            title="Map"
            src={data.mapUrl}
            className="h-72 w-full rounded-[var(--site-radius)] border-0 shadow-lg md:h-full"
            loading="lazy"
          />
        )}
      </div>
    </section>
  );
}
