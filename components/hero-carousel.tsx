"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type HeroCarouselSlide = {
  src: string;
  alt: string;
  label: string;
};

type HeroCarouselProps = {
  slides: HeroCarouselSlide[];
  intervalMs?: number;
};

export function HeroCarousel({
  slides,
  intervalMs = 5200,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slideCount = slides.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (!slideCount) {
        return;
      }

      setActiveIndex((index + slideCount) % slideCount);
    },
    [slideCount],
  );

  const showPrevious = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  const showNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  useEffect(() => {
    if (paused || slideCount <= 1) {
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
  }, [intervalMs, paused, slideCount]);

  if (!slideCount) {
    return null;
  }

  return (
    <div
      aria-label="Featured furniture project images"
      className="absolute inset-0"
      onBlur={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
    >
      {slides.map((slide, index) => (
        <div
          aria-hidden={index !== activeIndex}
          className={cn(
            "absolute inset-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
            index === activeIndex
              ? "z-10 translate-x-0 scale-100 opacity-100"
              : "z-0 translate-x-8 scale-[1.02] opacity-0",
          )}
          key={slide.src}
        >
          <Image
            alt={slide.alt}
            className="object-cover"
            fill
            priority={index === 0}
            sizes="100vw"
            src={slide.src}
          />
        </div>
      ))}
      <div className="absolute inset-0 z-20 bg-[#202238]/46" />

      {slideCount > 1 ? (
        <div className="absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-[#202238]/42 p-1.5 text-white backdrop-blur md:right-6 md:top-6">
          <button
            aria-label="Show previous hero image"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={showPrevious}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                aria-label={`Show ${slide.label}`}
                aria-pressed={index === activeIndex}
                className={cn(
                  "h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  index === activeIndex
                    ? "w-6 bg-white"
                    : "w-2.5 bg-white/45 hover:bg-white/75",
                )}
                key={slide.src}
                onClick={() => goToSlide(index)}
                type="button"
              />
            ))}
          </div>
          <button
            aria-label="Show next hero image"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={showNext}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
