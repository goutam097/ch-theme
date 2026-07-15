"use client";

import { Play } from "lucide-react";
import { useSectionItems } from "@/hooks/useSectionItems";
import { SAMPLE_TRACKS } from "../_shared/sampleData";
import type { AudioSectionProps } from "@/types";

/**
 * AudioV1 — Audio list. Tracks are fetched at render time from the content
 * backend using the block's source `slug`. Falls back to sample tracks until
 * real items load, so the design is always visible.
 */
const AudioV1 = ({ data }: AudioSectionProps) => {
  const { items } = useSectionItems("audio", data.slug);
  const tracks = items.length ? items : SAMPLE_TRACKS;

  return (
    <section className="py-12">
      <div className="container">

        <h2 className="text-3xl lg:text-4xl font-bold mb-12">
          Audio
        </h2>

        <div className="space-y-6">

          {tracks.map((track) => (
            <div
              key={track.id}
              className="border-b border-gray-300 pb-6"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

                {/* Left */}
                <div className="flex items-center gap-4 w-full lg:w-[40%]">

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />

                  <div>
                    <h3 className="text-xl font-medium geist-font mb-1">
                      {track.title}
                    </h3>

                    <p className="text-gray-600 font-medium text-sm leading-5">
                      {track.subtitle}
                    </p>

                    <p className="text-gray-600 text-sm leading-5">
                      {track.date}
                    </p>
                  </div>

                </div>

                {/* Wave */}
                <div className="w-full lg:flex-1">

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={track.waveform}
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
                    {track.duration}
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

export default AudioV1
