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
          ? "grid grid-cols-1 gap-4 sm:grid-cols-3"
          : isClients
          ? "grid w-full grid-cols-2 gap-4 px-4 [perspective:1400px] sm:grid-cols-3 sm:px-5 lg:grid-cols-4 lg:gap-5"
          : "grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#DED7CF] bg-[#DED7CF] sm:grid-cols-3 lg:grid-cols-4"
      }
    >
      {items.map((item) => (
        <div
          className={
            isPartners
              ? "group flex min-h-60 items-center justify-center rounded-lg border border-[#E6DDD1] bg-[#FCFBF8] p-10 shadow-[0_18px_45px_rgba(32,34,56,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#C56545]/45 hover:shadow-[0_24px_60px_rgba(32,34,56,0.14)]"
              : isClients
              ? "group relative flex min-h-44 items-center justify-center overflow-hidden rounded-lg border border-[#EADDCB] bg-white/95 p-7 shadow-[0_16px_36px_rgba(32,34,56,0.08)] transition duration-500 [transform-style:preserve-3d] hover:-translate-y-1 hover:border-[#026670]/30 hover:shadow-[0_26px_62px_rgba(2,102,112,0.16)] sm:min-h-52 sm:p-10"
              : "flex min-h-28 items-center justify-center bg-[#FCFBF8] p-5"
          }
          key={item.slug}
        >
          {isClients ? (
            <>
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(2,102,112,0.24),rgba(197,101,69,0.10)_42%,transparent_68%)] opacity-0 blur-xl transition duration-500 group-hover:opacity-100 sm:h-36 sm:w-52" />
              <span className="pointer-events-none absolute left-1/2 top-[64%] h-4 w-32 -translate-x-1/2 rounded-full bg-[#143F3D]/10 opacity-0 blur-md transition duration-500 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#026670]/40 to-transparent" />
            </>
          ) : null}
          {item.logo ? (
            <Image
              alt={`${item.name} logo`}
              className={
                isPartners
                  ? "max-h-44 max-w-[90%] object-contain transition duration-300 group-hover:scale-105"
                  : isClients
                  ? "relative z-10 max-h-20 max-w-[82%] object-contain drop-shadow-[0_12px_18px_rgba(32,34,56,0.12)] transition duration-500 [transform:translateZ(18px)_rotateX(0deg)_rotateY(0deg)] group-hover:scale-110 group-hover:[transform:translateZ(52px)_rotateX(8deg)_rotateY(-12deg)] group-hover:drop-shadow-[18px_22px_28px_rgba(2,102,112,0.22)] sm:max-h-28"
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
                  ? "relative z-10 text-center text-base font-bold uppercase tracking-[0.12em] text-[#202238] transition duration-500 [transform:translateZ(18px)] group-hover:scale-110 group-hover:[transform:translateZ(52px)_rotateX(8deg)_rotateY(-12deg)]"
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
