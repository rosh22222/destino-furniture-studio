"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useWishlist } from "@/components/wishlist-provider";
import { navItems, siteConfig } from "@/lib/constants";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { quoteWhatsappMessage, whatsappUrl } from "@/lib/whatsapp";

type HeaderProps = {
  categories: Category[];
  products: Product[];
};

export function Header({ categories, products }: HeaderProps) {
  const pathname = usePathname();
  const wishlist = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return products.slice(0, 6);
    }

    return products
      .filter((product) =>
        [product.name, product.shortDescription, product.furnitureType]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .slice(0, 8);
  }, [products, query]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#DED7CF] bg-[#FCFBF8]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FCFBF8]/88">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            aria-label="Destino Furniture Studio home"
            className="flex min-w-0 flex-col text-[#202238]"
            href="/"
            onClick={closeMenu}
          >
            <span className="text-xl font-extrabold uppercase leading-none tracking-[0.08em] md:text-2xl">
              Destino
            </span>
            <span className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#C56545]">
              Furniture Studio
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-5 lg:flex"
          >
            {navItems.map((item) => (
              <Link
                className={cn(
                  "text-sm font-semibold text-[#29282D] transition hover:text-[#C56545]",
                  pathname === item.href && "text-[#C56545]",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              aria-label="Search products"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#DED7CF] text-[#202238] transition hover:border-[#C56545] hover:text-[#C56545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545]"
              onClick={() => setSearchOpen(true)}
              type="button"
            >
              <Search aria-hidden="true" className="h-4 w-4" />
            </button>
            <Link
              aria-label={`Wishlist with ${wishlist.count} saved products`}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#DED7CF] text-[#202238] transition hover:border-[#C56545] hover:text-[#C56545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545]"
              href="/wishlist"
            >
              <Heart aria-hidden="true" className="h-4 w-4" />
              {wishlist.count ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#C56545] px-1 text-[0.65rem] font-bold text-white">
                  {wishlist.count}
                </span>
              ) : null}
            </Link>
            <a
              className="hidden h-11 items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-4 text-sm font-semibold text-white transition hover:bg-[#C56545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545] xl:inline-flex"
              href="/contact#quote"
            >
              <ShoppingBag aria-hidden="true" className="h-4 w-4" />
              Request a Quote
            </a>
            <button
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#DED7CF] text-[#202238] transition hover:border-[#C56545] hover:text-[#C56545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545] lg:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              type="button"
            >
              {menuOpen ? (
                <X aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-[#DED7CF] bg-[#FCFBF8] lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <nav aria-label="Mobile navigation" className="grid gap-1">
                {navItems.map((item) => (
                  <Link
                    className="rounded-[4px] px-3 py-3 text-sm font-semibold text-[#29282D] hover:bg-[#F5F1EA] hover:text-[#C56545]"
                    href={item.href}
                    key={item.href}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-4 text-sm font-semibold text-white"
                  href="/contact#quote"
                  onClick={closeMenu}
                >
                  <ShoppingBag aria-hidden="true" className="h-4 w-4" />
                  Request a Quote
                </Link>
              </nav>
              <div className="mt-4 border-t border-[#DED7CF] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b746e]">
                  Product categories
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      className="text-sm text-[#29282D] hover:text-[#C56545]"
                      href={`/products/${category.slug}`}
                      key={category.slug}
                      onClick={closeMenu}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {searchOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#202238]/40 p-4 backdrop-blur-sm"
          role="dialog"
        >
          <div className="mx-auto mt-20 max-w-2xl rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Search aria-hidden="true" className="h-5 w-5 text-[#C56545]" />
              <input
                autoFocus
                className="h-12 flex-1 bg-transparent text-base text-[#202238] outline-none"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search chairs, workstations, tables"
                value={query}
              />
              <button
                aria-label="Close search"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] text-[#202238] hover:bg-[#F5F1EA]"
                onClick={() => setSearchOpen(false)}
                type="button"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 divide-y divide-[#DED7CF] border-t border-[#DED7CF]">
              {results.length ? (
                results.map((product) => (
                  <Link
                    className="flex items-center justify-between gap-4 py-3 text-sm hover:text-[#C56545]"
                    href={`/product/${product.slug}`}
                    key={product.slug}
                    onClick={() => setSearchOpen(false)}
                  >
                    <span>
                      <span className="block font-semibold text-[#202238]">
                        {product.name}
                      </span>
                      <span className="text-[#625f5a]">{product.furnitureType}</span>
                    </span>
                    <span className="text-[#C56545]">View</span>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-sm text-[#625f5a]">
                  No matching products found. Try office chairs, workstations or
                  cafeteria furniture.
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-[#DED7CF] pt-4 sm:flex-row">
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[4px] border border-[#DED7CF] px-4 text-sm font-semibold text-[#202238] hover:border-[#C56545] hover:text-[#C56545]"
                href={`tel:${siteConfig.phoneHref}`}
              >
                <Phone aria-hidden="true" className="h-4 w-4" />
                Call {siteConfig.phoneDisplay}
              </a>
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-4 text-sm font-semibold text-white hover:bg-[#C56545]"
                href={whatsappUrl(quoteWhatsappMessage([], pathname))}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp enquiry
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

