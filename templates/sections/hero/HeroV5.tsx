"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HeroSectionProps } from "@/types";

/** HeroV5 - Bloom: auto-rotating image carousel behind centered text. Uses carousel[]. */
export default function HeroV5({ data }: HeroSectionProps) {
  const slides = data.carousel?.length ? data.carousel : data.image ? [data.image] : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden text-center">
      <AnimatePresence mode="wait">
        {slides[index] && (
          <motion.img
            key={slides[index]}
            src={slides[index]}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-linear-to-br from-[var(--site-primary)]/70 to-[var(--site-accent)]/60" />

      <div className="relative mx-auto max-w-3xl px-6 text-white">
        {data.subtitle && (
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em]">
            {data.subtitle}
          </p>
        )}
        <h1 className="text-5xl font-bold leading-tight drop-shadow [font-family:var(--site-font-heading)] md:text-6xl">
          {data.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/90">{data.description}</p>
        {data.buttonText && (
          <a
            href={data.buttonLink || "#"}
            className="mt-8 inline-flex items-center rounded-[var(--site-radius)] bg-white px-8 py-4 font-semibold text-[color:var(--site-primary)] shadow-xl transition hover:scale-105"
          >
            {data.buttonText}
          </a>
        )}

        {slides.length > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
