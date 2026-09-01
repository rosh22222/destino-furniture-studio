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
  const [isTransitioning, setIsTransitioning] = useState(true);
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
      setIsTransitioning(true);
      setActiveIndex((current) => current + 1);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, slideCount]);

  useEffect(() => {
    if (activeIndex === slideCount) {
      const resetTimer = window.setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(0);
      }, 700); // Must match the CSS transition duration (700ms)

      return () => window.clearTimeout(resetTimer);
    }
  }, [activeIndex, slideCount]);

  if (!slideCount) {
    return null;
  }

  // Clone the first slide at the end to create a seamless infinite loop effect
  const extendedSlides = [...slides, slides[0]];

  return (
    <div
      aria-label="Featured furniture project images"
      className="relative w-full overflow-hidden bg-[#FCFBF8]"
      role="region"
    >
      <div 
        className={cn(
          "flex w-full ease-in-out motion-reduce:transition-none",
          isTransitioning ? "transition-transform duration-700" : "transition-none"
        )}
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {extendedSlides.map((slide, index) => (
          <div
            aria-hidden={index !== activeIndex && !(index === 0 && activeIndex === slideCount)}
            className="w-full shrink-0 relative"
            key={index}
          >
            {typeof slide.src === "string" ? (
              <div className="relative w-full h-[60vh] min-h-[400px]">
                <Image
                  alt={slide.alt}
                  className="object-cover"
                  fill
                  priority={index === 0 || index === slideCount}
                  sizes="100vw"
                  src={slide.src}
                />
              </div>
            ) : (
              <Image
                alt={slide.alt}
                className="w-full h-auto object-cover"
                priority={index === 0 || index === slideCount}
                sizes="100vw"
                src={slide.src}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
