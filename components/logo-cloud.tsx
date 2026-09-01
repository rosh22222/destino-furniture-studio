import Image from "next/image";

import type { Brand, Client } from "@/lib/types";

type LogoCloudProps = {
  items: Array<Brand | Client>;
  variant?: "default" | "partners" | "marquee" | "clients";
};

export function LogoCloud({ items, variant = "default" }: LogoCloudProps) {
  const isPartners = variant === "partners";
  const isMarquee = variant === "marquee";
  const isClients = variant === "clients";

  if (isMarquee) {
    const scrollingItems = [...items, ...items];

    return (
      <div className="group w-full overflow-hidden py-2">
        <div className="flex w-max animate-[client-logo-scroll_42s_linear_infinite] items-center gap-10 px-8 group-hover:[animation-play-state:paused] sm:gap-12 lg:gap-14">
          {scrollingItems.map((item, index) => (
            <div
              className="flex h-24 w-48 flex-none items-center justify-center rounded-xl bg-white px-6 shadow-[0_8px_20px_rgba(32,34,56,0.06)] sm:h-32 sm:w-60 lg:h-40 lg:w-72"
              key={`${item.slug}-${index}`}
            >
              {item.logo ? (
                <Image
                  alt={`${item.name} logo`}
                  className="max-h-16 max-w-[84%] object-contain sm:max-h-20 lg:max-h-24"
                  height={180}
                  priority={index < items.length}
                  src={item.logo}
                  width={380}
                />
              ) : (
                <span className="text-center text-base font-bold uppercase tracking-[0.12em] text-[#202238] sm:text-lg">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isPartners
          ? "grid grid-cols-1 gap-5 sm:grid-cols-3"
          : isClients
          ? "grid grid-cols-2 gap-px border-y border-[#DED7CF] bg-[#DED7CF] sm:grid-cols-3 lg:grid-cols-4"
          : "grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#DED7CF] bg-[#DED7CF] sm:grid-cols-3 lg:grid-cols-4"
      }
    >
      {items.map((item) => (
        <div
          className={
            isPartners
              ? "group flex min-h-60 items-center justify-center rounded-lg border border-[#E6DDD1] bg-[#FCFBF8] p-10 shadow-[0_18px_45px_rgba(32,34,56,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#C56545]/45 hover:shadow-[0_24px_60px_rgba(32,34,56,0.14)]"
              : isClients
              ? "group flex min-h-48 items-center justify-center bg-[#FCFBF8] p-8 sm:min-h-56 sm:p-12 transition-colors hover:bg-white"
              : "flex min-h-28 items-center justify-center bg-[#FCFBF8] p-5"
          }
          key={item.slug}
        >
          {item.logo ? (
            <Image
              alt={`${item.name} logo`}
              className={
                isPartners
                  ? "max-h-44 max-w-[90%] object-contain transition duration-300 group-hover:scale-105"
                  : isClients
                  ? "max-h-24 max-w-[85%] object-contain transition duration-300 group-hover:scale-110 sm:max-h-32"
                  : "max-h-14 w-auto object-contain"
              }
              height={isPartners || isClients ? 200 : 64}
              priority={isPartners}
              src={item.logo}
              width={isPartners || isClients ? 560 : 180}
            />
          ) : (
            <span
              className={
                isPartners || isClients
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
