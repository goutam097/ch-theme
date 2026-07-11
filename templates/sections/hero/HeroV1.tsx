"use client";

import type { HeroSectionProps } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const styles = {
  bannerSec: {
    position: "relative" as const,
  },
  media: {
    width: "100%",
    height: "750px",
    objectFit: "cover" as const,
  },
  bannerCont: {
    position: "absolute" as const,
    zIndex: 3,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
  }
};

export default function HeroV1({ data }: HeroSectionProps) {
  console.log(data,'000000000000000000')
  return (
    <section
      className="relative min-h-100 bg-cover bg-center" style={styles.bannerSec}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      {data?.image && <img src={data.image} style={styles.media} />}
      {data?.video && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={styles.media}
        >
          <source src={data.video} type="video/mp4" />
        </video>
      )}
      {
        data?.carousel && data.carousel.length > 0 && (
          <>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop={true}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                481: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 1,
                },
                1024: {
                  slidesPerView: 1,
                },
                1280: {
                  slidesPerView: 1,
                },
              }}
            >
              {data?.carousel?.map((item: string, index: number) => (
                <SwiperSlide key={index}>
                  <img
                    src={item}
                    alt={`carousel-${index}`}
                    style={styles.media}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )
      }

      {/* Content */}
      <div style={styles.bannerCont}>
        <div className="container z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto w-full px-3 lg:px-4">
            <div className="w-full">

              {data.subtitle && (
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  {data.subtitle}
                </p>
              )}

              {data.title && (
                <h1 className="text-white font-semibold leading-tight text-3xl lg:text-5xl max-w-3xl">
                  {data.title}
                </h1>
              )}

              {data.description && (
                <p
                  className="mt-5 max-w-xl whitespace-pre-wrap text-base leading-6 font-medium text-white/90 montserrat-font"
                >
                  {data.description}
                </p>
              )}

              {data.buttonText && (
                <a
                  href={data.buttonLink || "#"}
                  className="mt-8 inline-flex w-fit items-center rounded bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-white/90"
                >
                  {data.buttonText}
                </a>
              )}

            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
