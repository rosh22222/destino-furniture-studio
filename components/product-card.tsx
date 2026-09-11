import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";

import { WishlistButton } from "@/components/wishlist-button";
import { stripRichText } from "@/lib/rich-text";
import type { Brand, Category, Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  category?: Category;
  brand?: Brand;
  priority?: boolean;
};

export function ProductCard({
  product,
  priority,
}: ProductCardProps) {
  const href = `/product/${product.slug}`;
  const previewDescription = stripRichText(product.shortDescription);

  return (
    <article className="group relative overflow-hidden rounded-lg bg-white transition-shadow duration-300 hover:shadow-md">
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F5EF]">
        <Link className="block h-full w-full" href={href}>
          {product.image ? (
            <Image
              alt={`${product.name} by Destino Furniture Studio`}
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
              fill
              priority={priority}
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
              src={product.image}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
              No Image
            </div>
          )}
        </Link>
        
        {/* Wishlist Overlay */}
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton 
            slug={product.slug} 
            className="!h-8 !w-8 !min-w-0 !p-0 !rounded-full shadow-sm bg-white/90 backdrop-blur-sm [&>span]:hidden" 
          />
        </div>
        

      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {previewDescription && (
              <p className="text-[15px] font-medium text-[#4F4B4A] line-clamp-2 leading-relaxed">
                <Link className="hover:text-[#C56545]" href={href}>
                  {previewDescription}
                </Link>
              </p>
            )}
          </div>
          <button aria-label="Share" className="shrink-0 text-gray-400 hover:text-gray-700 mt-0.5">
            <Share2 className="h-[14px] w-[14px]" />
          </button>
        </div>
        
        <div className="mt-4">
          <Link href={`${href}#quote`} className="text-[15px] font-bold text-[#202238] hover:text-[#C56545] transition-colors">
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
