"use client";

import { Play } from "lucide-react";
import { useSectionItems } from "@/hooks/useSectionItems";
import { SAMPLE_TRACKS } from "../_shared/sampleData";
import type { PodcastSectionProps } from "@/types";

/**
 * PodcastV1 — Podcast list. Tracks are fetched at render time from the content
 * backend using the block's source `slug`. Falls back to sample tracks until
 * real items load, so the design is always visible.
 */
const PodcastV1 = ({ data }: PodcastSectionProps) => {
  const { items } = useSectionItems("podcast", data.slug);
  const podcasts = items.length ? items : SAMPLE_TRACKS;

  return (
    <section className="py-12">
      <div className="container">

        <h2 className="text-3xl lg:text-4xl font-bold mb-12">
          Podcast
        </h2>

        <div className="space-y-6">

          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="border-b border-gray-300 pb-6"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

                {/* Left */}
                <div className="flex items-center gap-4 w-full lg:w-[40%]">

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={podcast.image}
                    alt={podcast.title}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />

                  <div>
                    <h3 className="text-xl font-medium geist-font mb-1">
                      {podcast.title}
                    </h3>

                    <p className="text-gray-600 font-medium text-sm leading-5">
                      {podcast.subtitle}
                    </p>

                    <p className="text-gray-600 text-sm leading-5">
                      {podcast.date}
                    </p>
                  </div>

                </div>

                {/* Wave */}
                <div className="w-full lg:flex-1">

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={podcast.waveform}
                    alt="Waveform"
                    className="w-full h-20 object-contain"
                  />

                </div>

                {/* Right */}
                <div className="flex items-center gap-5">

                  <button
                    className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition duration-300"
                  >
                    <Play size={24} className="fill-current ml-1" />
                  </button>

                  <span className="text-[14px] font-medium">
                    {podcast.duration}
                  </span>

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  )
}

export default PodcastV1
