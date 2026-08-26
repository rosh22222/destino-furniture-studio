"use client";

import { Heart } from "lucide-react";

import { useWishlist } from "@/components/wishlist-provider";
import { cn } from "@/lib/utils";

export function WishlistButton({
  slug,
  label = "Save product",
  className,
}: {
  slug: string;
  label?: string;
  className?: string;
}) {
  const wishlist = useWishlist();
  const active = wishlist.has(slug);

  return (
    <button
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : label}
      className={cn(
        "inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-[4px] border border-[#DED7CF] bg-[#FCFBF8] px-3 text-sm font-semibold text-[#202238] transition hover:border-[#C56545] hover:text-[#C56545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545]",
        active && "border-[#C56545] bg-[#F5F1EA] text-[#C56545]",
        className,
      )}
      onClick={() => wishlist.toggle(slug)}
      type="button"
    >
      <Heart
        aria-hidden="true"
        className={cn("h-4 w-4", active && "fill-current")}
      />
      <span className="hidden sm:inline">{active ? "Saved" : "Save"}</span>
    </button>
  );
}

