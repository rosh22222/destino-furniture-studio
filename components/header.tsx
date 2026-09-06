"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { navItems } from "@/lib/constants";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type HeaderProps = {
  categories: Category[];
  products: Product[];
};

export function Header({ categories }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#DED7CF] bg-[#FCFBF8]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FCFBF8]/88">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            aria-label="Destino Furniture Studio home"
            className="flex min-w-0 items-center text-[#202238]"
            href="/"
            onClick={closeMenu}
          >
            <Image
              src="/images/logo/logo_destino.png"
              alt="Destino Furniture Studio Logo"
              width={240}
              height={70}
              className="h-12 w-auto md:h-14 lg:h-16"
              priority
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 lg:flex"
          >
            {navItems.map((item) => (
              <Link
                className={cn(
                  "px-2 py-1 text-[17px] font-bold text-[#1E3A8A] transition hover:text-[#C56545]",
                  pathname === item.href && "text-[#C56545]",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              className="hidden h-11 items-center justify-center rounded-full bg-[#202238] px-7 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C56545] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545] lg:inline-flex"
              href="/franchise"
            >
              Franchise
            </Link>
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
                    className="rounded-[4px] px-3 py-3 text-base font-bold text-[#1E3A8A] hover:bg-[#F5F1EA] hover:text-[#C56545]"
                    href={item.href}
                    key={item.href}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[#202238] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C56545] hover:shadow-md"
                  href="/franchise"
                  onClick={closeMenu}
                >
                  Franchise
                </Link>
              </nav>
              <div className="mt-4 border-t border-[#DED7CF] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b746e]">
                  Product categories
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      className="text-sm text-[#1E3A8A] hover:text-[#C56545]"
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
    </>
  );
}
