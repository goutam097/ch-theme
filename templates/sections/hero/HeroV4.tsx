"use client";

import { motion } from "framer-motion";
import type { HeroSectionProps } from "@/types";

/** HeroV4 - Pulse: full-bleed background video with a dark overlay. Uses video (falls back to image). */
export default function HeroV4({ data }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      {data.video ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={data.video}
          autoPlay
          muted
          loop
          playsInline
          poster={data.image}
        />
      ) : (
        data.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={data.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/30" />

      <div className="relative mx-auto w-full max-w-5xl px-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {data.subtitle && (
            <span className="inline-block rounded-full border border-[var(--site-accent)] px-4 py-1.5 text-sm font-medium text-[color:var(--site-accent)]">
              {data.subtitle}
            </span>
          )}
          <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-tight [font-family:var(--site-font-heading)] md:text-7xl">
            {data.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">{data.description}</p>
          {data.buttonText && (
            <a
              href={data.buttonLink || "#"}
              className="mt-8 inline-flex items-center rounded-[var(--site-radius)] bg-[var(--site-primary)] px-8 py-4 font-semibold text-black shadow-2xl transition hover:scale-105"
            >
              {data.buttonText}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
