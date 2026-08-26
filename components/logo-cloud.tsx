import Image from "next/image";

import type { Brand, Client } from "@/lib/types";

type LogoCloudProps = {
  items: Array<Brand | Client>;
};

export function LogoCloud({ items }: LogoCloudProps) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#DED7CF] bg-[#DED7CF] sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          className="flex min-h-28 items-center justify-center bg-[#FCFBF8] p-5"
          key={item.slug}
        >
          {item.logo ? (
            <Image
              alt={`${item.name} logo`}
              className="max-h-14 w-auto object-contain"
              height={64}
              src={item.logo}
              width={180}
            />
          ) : (
            <span className="text-center text-sm font-semibold uppercase tracking-[0.12em] text-[#202238]">
              {item.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

