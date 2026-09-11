"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { SafeGalleryImage } from "@/components/safe-gallery-image";

type ProductImageGalleryProps = {
  images: string[];
  title: string;
};

function normalizeImageSrc(src: string) {
  try {
    const url = new URL(src, "http://localhost");

    if (url.pathname === "/_next/image") {
      return url.searchParams.get("url") || src;
    }
  } catch {
    return src;
  }

  return src;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const galleryImages = useMemo(
    () => Array.from(new Set(images.filter(Boolean).map(normalizeImageSrc))),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = galleryImages.length > 1;

  const previous = () => {
    setActiveIndex((index) =>
      index === 0 ? galleryImages.length - 1 : index - 1,
    );
  };

  const next = () => {
    setActiveIndex((index) =>
      index === galleryImages.length - 1 ? 0 : index + 1,
    );
  };

  if (!galleryImages.length) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-[#DED7CF] bg-[#F8F5EF] text-gray-400">
        No Image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-[#DED7CF] bg-[#F8F5EF]">
        <SafeGalleryImage
          alt={`${title} image ${activeIndex + 1}`}
          className="object-contain p-4"
          priority
          sizes="(min-width: 1024px) 52vw, 92vw"
          src={galleryImages[activeIndex]}
        />

        {hasMultipleImages ? (
          <>
            <button
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1E3A8A] shadow-[0_10px_24px_rgba(32,34,56,0.16)] transition hover:bg-[#026670] hover:text-white"
              onClick={previous}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              aria-label="Next product image"
              className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1E3A8A] shadow-[0_10px_24px_rgba(32,34,56,0.16)] transition hover:bg-[#026670] hover:text-white"
              onClick={next}
              type="button"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1E3A8A] shadow-sm">
              {activeIndex + 1} / {galleryImages.length}
            </div>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#026670]">
            Gallery images
          </p>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {galleryImages.map((image, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  aria-label={`Show ${title} image ${index + 1}`}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg border bg-[#F8F5EF] transition ${
                    isActive
                      ? "border-[#026670] ring-2 ring-[#026670]/20"
                      : "border-[#DED7CF] hover:border-[#C56545]"
                  }`}
                  key={`${image}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <SafeGalleryImage
                    alt={`${title} thumbnail ${index + 1}`}
                    className="object-contain p-1.5"
                    sizes="160px"
                    src={image}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
