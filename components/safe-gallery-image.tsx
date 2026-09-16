/* eslint-disable @next/next/no-img-element */

import Image from "next/image";

import { isVideoMedia } from "@/lib/admin-media";

type SafeGalleryImageProps = {
  alt: string;
  className?: string;
  controls?: boolean;
  priority?: boolean;
  sizes: string;
  src: string;
};

function isRemoteImage(src: string) {
  try {
    const url = new URL(src);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function SafeGalleryImage({
  alt,
  className = "",
  controls = false,
  priority,
  sizes,
  src,
}: SafeGalleryImageProps) {
  if (isVideoMedia(src)) {
    return (
      <video
        aria-label={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
        controls={controls}
        muted
        playsInline
        preload="metadata"
        src={src}
      />
    );
  }

  if (isRemoteImage(src)) {
    return (
      <img
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        src={src}
      />
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      fill
      priority={priority}
      sizes={sizes}
      src={src}
    />
  );
}
