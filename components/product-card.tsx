import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { WishlistButton } from "@/components/wishlist-button";
import { whatsappUrl, productWhatsappMessage } from "@/lib/whatsapp";
import type { Brand, Category, Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  category?: Category;
  brand?: Brand;
  priority?: boolean;
};

export function ProductCard({
  product,
  category,
  brand,
  priority,
}: ProductCardProps) {
  const href = `/product/${product.slug}`;

  return (
    <article className="group overflow-hidden rounded-lg border border-[#DED7CF] bg-[#FCFBF8]">
      <Link className="block" href={href}>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F1EA]">
          <Image
            alt={`${product.name} by Destino Furniture Studio`}
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            fill
            priority={priority}
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
            src={product.image}
          />
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7b746e]">
            <span>{category?.name || "Furniture"}</span>
            {brand ? <span>{brand.name}</span> : null}
          </div>
          <h3 className="text-lg font-semibold leading-snug text-[#202238]">
            <Link className="hover:text-[#C56545]" href={href}>
              {product.name}
            </Link>
          </h3>
          <p className="line-clamp-3 text-sm leading-6 text-[#625f5a]">
            {product.shortDescription}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] hover:text-[#202238]"
            href={href}
          >
            Details <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <a
              aria-label={`WhatsApp enquiry for ${product.name}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#DED7CF] text-[#202238] transition hover:border-[#C56545] hover:text-[#C56545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545]"
              href={whatsappUrl(productWhatsappMessage(product.name, href))}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
            </a>
            <WishlistButton slug={product.slug} />
          </div>
        </div>
      </div>
    </article>
  );
}

