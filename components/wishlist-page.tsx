"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Trash2 } from "lucide-react";

import { LeadForm } from "@/components/lead-form";
import { useWishlist } from "@/components/wishlist-provider";
import { quoteWhatsappMessage, whatsappUrl } from "@/lib/whatsapp";

export function WishlistPage() {
  const wishlist = useWishlist();
  const productNames = wishlist.products.map((product) => product.name);

  if (!wishlist.products.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-8 text-center">
          <h1 className="text-3xl font-semibold text-[#202238]">Wishlist</h1>
          <p className="mx-auto mt-3 max-w-xl text-[#625f5a]">
            Saved products will appear here on this device. Explore the
            catalogue and add items for a combined quotation.
          </p>
          <Link
            className="mt-6 inline-flex h-12 items-center justify-center rounded-[4px] bg-[#202238] px-5 text-sm font-semibold text-white hover:bg-[#C56545]"
            href="/products"
          >
            Explore products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
                Saved products
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#202238]">
                Wishlist
              </h1>
            </div>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[4px] border border-[#DED7CF] px-4 text-sm font-semibold text-[#202238] hover:border-[#C56545] hover:text-[#C56545]"
              onClick={wishlist.clear}
              type="button"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Clear all
            </button>
          </div>
          <div className="grid gap-4">
            {wishlist.products.map((product) => (
              <article
                className="grid gap-4 rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-4 sm:grid-cols-[140px_1fr_auto]"
                key={product.slug}
              >
                <Link
                  className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-[#F5F1EA]"
                  href={`/product/${product.slug}`}
                >
                  {product.image ? (
                    <Image
                      alt={product.name}
                      className="object-cover"
                      fill
                      sizes="140px"
                      src={product.image}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </Link>
                <div>
                  <h2 className="text-lg font-semibold text-[#202238]">
                    <Link
                      className="hover:text-[#C56545]"
                      href={`/product/${product.slug}`}
                    >
                      {product.name}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#625f5a]">
                    {product.shortDescription}
                  </p>
                </div>
                <button
                  aria-label={`Remove ${product.name}`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#DED7CF] text-[#202238] hover:border-[#C56545] hover:text-[#C56545]"
                  onClick={() => wishlist.remove(product.slug)}
                  type="button"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <a
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-5 text-sm font-semibold text-white hover:bg-[#C56545]"
            href={whatsappUrl(quoteWhatsappMessage(productNames, "/wishlist"))}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            WhatsApp combined quote
          </a>
          <LeadForm
            intent="quote"
            products={productNames}
            sourcePath="/wishlist"
            title="Request combined quotation"
          />
        </div>
      </div>
    </section>
  );
}

