"use client";

import { useSectionItems } from "@/hooks/useSectionItems";
import { SAMPLE_EVENTS } from "../_shared/sampleData";
import type { EventSectionProps } from "@/types";

/**
 * EventV1 — Events list. Items are fetched at render time from the content
 * backend using the block's source `slug`; nothing is stored in the site. Until
 * real items load (empty slug, still fetching, or none returned) it shows sample
 * events so the design is always visible.
 */
const EventV1 = ({ data }: EventSectionProps) => {
  const { items } = useSectionItems("event", data.slug);
  const events = items.length ? items : SAMPLE_EVENTS;

  return (
    <section className="py-12 pt-0">
      <div className="container">

        <h2 className="text-3xl lg:text-4xl font-bold mb-12">
          Event List
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {events.map((event) => (
            <div key={event.id} className="bg-gray-100 rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300">
                {/* Image */}
                <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.image} alt={event.title} className="w-full h-60 object-cover transition duration-500 hover:scale-105" />
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-lg font-medium leading-snug line-clamp-2 geist-font">
                        {event.title}
                    </h3>

                    <p className="mt-2 text-base">
                        {event.channel}
                    </p>

                    <div className="flex items-center flex-wrap text-gray-500 text-sm gap-2">
                        <span>{event.views}</span>
                        <span>•</span>
                        <span>{event.release}</span>
                    </div>

                </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default EventV1
