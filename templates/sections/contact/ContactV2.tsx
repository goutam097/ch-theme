"use client";

import type { ContactSectionProps } from "@/types";

/** ContactV2 — Meridian: three-up info bar over a full-width map. */
export default function ContactV2({ data }: ContactSectionProps) {
  const items = [
    { label: "Call us", value: data.phone, href: `tel:${data.phone}` },
    { label: "Email us", value: data.email, href: `mailto:${data.email}` },
    { label: "Visit us", value: data.address },
  ];
  return (
    <section id="contact">
      <div className="bg-[var(--site-primary)] px-6 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 text-center md:grid-cols-3">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                {item.label}
              </p>
              {item.href ? (
                <a href={item.href} className="mt-2 block text-lg font-medium hover:underline">
                  {item.value}
                </a>
              ) : (
                <p className="mt-2 text-lg font-medium">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      {data.mapUrl && (
        <iframe title="Map" src={data.mapUrl} className="h-80 w-full border-0" loading="lazy" />
      )}
    </section>
  );
}
