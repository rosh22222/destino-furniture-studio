import Image from "next/image";

import type { Brand, Client } from "@/lib/types";

type LogoCloudProps = {
  items: Array<Brand | Client>;
  variant?: "default" | "partners";
};

export function LogoCloud({ items, variant = "default" }: LogoCloudProps) {
  const isPartners = variant === "partners";

  return (
    <div
      className={
        isPartners
          ? "grid grid-cols-1 gap-4 sm:grid-cols-3"
          : "grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#DED7CF] bg-[#DED7CF] sm:grid-cols-3 lg:grid-cols-4"
      }
    >
      {items.map((item) => (
        <div
          className={
            isPartners
              ? "group flex min-h-40 items-center justify-center rounded-lg border border-[#E6DDD1] bg-[#FCFBF8] p-8 shadow-[0_18px_45px_rgba(32,34,56,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#C56545]/45 hover:shadow-[0_24px_60px_rgba(32,34,56,0.14)]"
              : "flex min-h-28 items-center justify-center bg-[#FCFBF8] p-5"
          }
          key={item.slug}
        >
          {item.logo ? (
            <Image
              alt={`${item.name} logo`}
              className={
                isPartners
                  ? "max-h-24 w-auto object-contain transition duration-300 group-hover:scale-105"
                  : "max-h-14 w-auto object-contain"
              }
              height={isPartners ? 112 : 64}
              priority={isPartners}
              src={item.logo}
              width={isPartners ? 300 : 180}
            />
          ) : (
            <span
              className={
                isPartners
                  ? "text-center text-base font-bold uppercase tracking-[0.12em] text-[#202238]"
                  : "text-center text-sm font-semibold uppercase tracking-[0.12em] text-[#202238]"
              }
            >
              {item.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
