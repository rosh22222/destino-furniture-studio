"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);
  const previous = useCallback(() => {
    setActiveIndex((value) =>
      value === null ? null : value === 0 ? images.length - 1 : value - 1,
    );
  }, [images.length]);
  const next = useCallback(() => {
    setActiveIndex((value) =>
      value === null ? null : value === images.length - 1 ? 0 : value + 1,
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
      if (event.key === "ArrowLeft") {
        previous();
      }
      if (event.key === "ArrowRight") {
        next();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, next, previous]);

  if (!images.length) {
    return null;
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            aria-label={`Open ${title} image ${index + 1}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-[#DED7CF] bg-[#F5F1EA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545]"
            key={image}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <Image
              alt={`${title} gallery image ${index + 1}`}
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              src={image}
            />
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          role="dialog"
        >
          <div className="flex items-center justify-between border-b border-white/10 p-4 text-white">
            <h2 className="text-base font-semibold">{title}</h2>
            <button
              aria-label="Close gallery"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] hover:bg-white/10"
              onClick={close}
              type="button"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-4">
            <button
              aria-label="Previous image"
              className="absolute left-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-[4px] bg-white/10 text-white hover:bg-white/20"
              onClick={previous}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="h-6 w-6" />
            </button>
            <div className="relative h-full max-h-[78vh] w-full max-w-6xl">
              <Image
                alt={`${title} enlarged image ${activeIndex + 1}`}
                className="object-contain"
                fill
                sizes="100vw"
                src={images[activeIndex]}
              />
            </div>
            <button
              aria-label="Next image"
              className="absolute right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-[4px] bg-white/10 text-white hover:bg-white/20"
              onClick={next}
              type="button"
            >
              <ChevronRight aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
