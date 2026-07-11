"use client";

import { motion } from "framer-motion";
import type { HeroSectionProps } from "@/types";

/** HeroV2 — Meridian: full-height image panel beside a solid text panel. */
export default function HeroV2({ data }: HeroSectionProps) {
  return (
    <>
    <section
      className="relative overflow-hidden flex items-center flex-col gap-20 bg-cover bg-center pt-60 pb-20"
      style={{
        backgroundImage: `url(${data.image})`,
      }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 lg:px-8">

        <div className="max-w-4xl">

          <div className="bg-black/20 backdrop-blur-[2px] p-6 lg:p-5">
            <h1 className="text-white font-semibold leading-tight text-3xl lg:text-5xl">
              {data.title}
            </h1>
          </div>

          <div className="mt-8 max-w-xl">

            <p className="text-white text-base leading-6 montserrat-font">
             {data.description}
            </p>

            {/* <p className="mt-6 text-white text-base leading-6 montserrat-font">
              {data?.description}
            </p> */}

          </div>

        </div>

      </div>

      <div className="relative  hidden lg:flex items-center gap-4">
        <span className="w-12 h-[1px] bg-white"></span>

        <p className="text-white text-xl font-medium">
          Better control your senses
        </p>

        <span className="w-12 h-[1px] bg-white"></span>
      </div>
    </section>
    
    {/* <section className="grid min-h-[70vh] md:grid-cols-2">
      <div className="flex flex-col justify-center bg-[var(--site-primary)] px-8 py-16 text-white md:px-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {data.subtitle && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              {data.subtitle}
            </p>
          )}
          <h1 className="text-4xl font-bold leading-tight [font-family:var(--site-font-heading)] md:text-5xl">
            {data.title}
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/85">{data.description}</p>
          {data.buttonText && (
            <a
              href={data.buttonLink || "#"}
              className="mt-8 inline-flex w-fit items-center rounded-[var(--site-radius)] bg-white px-7 py-3.5 font-semibold text-[color:var(--site-primary)] transition hover:bg-white/90"
            >
              {data.buttonText}
            </a>
          )}
        </motion.div>
      </div>
      <div className="relative min-h-[40vh] bg-[var(--site-muted)]">
        {data.image && (
          <img
            src={data.image}
            alt={data.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
    </section> */}
    </>
  );
}
