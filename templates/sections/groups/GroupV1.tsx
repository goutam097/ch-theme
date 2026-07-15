"use client";

import { useSectionItems } from "@/hooks/useSectionItems";
import { SAMPLE_GROUPS } from "../_shared/sampleData";
import type { GroupSectionProps } from "@/types";

/**
 * GroupV1 — Groups list. Items are fetched at render time from the content
 * backend using the block's source `slug`. Falls back to sample groups until
 * real items load, so the design is always visible.
 */
const GroupV1 = ({ data }: GroupSectionProps) => {
  const { items } = useSectionItems("group", data.slug);
  const groups = items.length ? items : SAMPLE_GROUPS;

  return (
     <section className="py-12 pt-0">
      <div className="container">
        <h2 className="text-3xl lg:text-4xl font-bold mb-10">
          Group
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="border border-gray-300 rounded-2xl bg-white p-2.5 transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">

                {/* Left */}
                <div className="flex items-center gap-4 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={group.image} alt={group.title} className="w-18 h-18 rounded-xl object-cover flex-shrink-0" />

                  <div className="flex-1">
                    <h3 className="text-base font-medium leading-snug line-clamp-2 geist-font">
                        {group.title}
                    </h3>

                    <p className="text-gray-500 text-[14px]">
                      {group.members}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button className="cursor-pointer bg-[#322E2E] hover:bg-black text-white text-[12px] font-semibold px-4 py-1.5 rounded-lg transition-all duration-300 whitespace-nowrap">
                    View Groups
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GroupV1
