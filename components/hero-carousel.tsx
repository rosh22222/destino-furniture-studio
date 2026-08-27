"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type HeroCarouselSlide = {
  src: string | StaticImageData;
  alt: string;
  label: string;
};

type HeroCarouselProps = {
  slides: HeroCarouselSlide[];
  intervalMs?: number;
};

export function HeroCarousel({
  slides,
  intervalMs = 3000,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = slides.length;

  useEffect(() => {
    if (slideCount <= 1) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, slideCount]);

  if (!slideCount) {
    return null;
  }

  return (
    <div
      aria-label="Featured furniture project images"
      className="relative w-full overflow-hidden bg-[#FCFBF8]"
      role="region"
    >
      {slides.map((slide, index) => (
        <div
          aria-hidden={index !== activeIndex}
          className={cn(
            "w-full transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
            index === activeIndex
              ? "relative z-10 translate-x-0 scale-100 opacity-100"
              : "absolute top-0 left-0 z-0 translate-x-8 scale-[1.02] opacity-0",
          )}
          key={typeof slide.src === "string" ? slide.src : slide.src.src}
        >
          {typeof slide.src === "string" ? (
            <Image
              alt={slide.alt}
              className="object-cover"
              fill
              priority={index === 0}
              sizes="100vw"
              src={slide.src}
            />
          ) : (
            <Image
              alt={slide.alt}
              className="w-full h-auto"
              priority={index === 0}
              sizes="100vw"
              src={slide.src}
            />
          )}
        </div>
      ))}
    </div>
  );
}
