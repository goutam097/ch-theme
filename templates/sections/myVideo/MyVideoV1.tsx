"use client";

import { Play } from "lucide-react";
import { useSectionItems } from "@/hooks/useSectionItems";
import { SAMPLE_VIDEOS } from "../_shared/sampleData";
import type { VideoSectionProps } from "@/types";

/**
 * MyVideoV1 — My Videos list. Items are fetched at render time from the content
 * backend using the block's source `slug`. Falls back to sample videos until
 * real items load, so the design is always visible.
 */
const MyVideoV1 = ({ data }: VideoSectionProps) => {
  const { items } = useSectionItems("video", data.slug);
  const videos = items.length ? items : SAMPLE_VIDEOS;

  return (
    <section className="py-12 pt-0">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">
            My Video List
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="relative h-54 md:h-48 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={video.image} alt={video.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <button
                      disabled={!video.youtubeId}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition
                        ${
                          video.youtubeId
                            ? "bg-white/90 hover:scale-110 cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                      <Play size={28} className="text-black fill-black ml-1" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-lg lg:text-xl font-medium geist-font mb-1">
                    {video.title}
                  </h4>

                  <p className="text-gray-600 text-sm">{video.date}</p>

                  <p className="text-gray-700 text-[15px]">
                    {video.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default MyVideoV1
