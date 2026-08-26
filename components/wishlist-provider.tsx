"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Product } from "@/lib/types";

type WishlistContextValue = {
  slugs: string[];
  products: Product[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const storageKey = "destino-wishlist";

export function WishlistProvider({
  children,
  allProducts,
}: {
  children: ReactNode;
  allProducts: Product[];
}) {
  const [slugs, setSlugs] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      return [];
    }

    return [];
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(slugs));
  }, [slugs]);

  const products = useMemo(
    () => allProducts.filter((product) => slugs.includes(product.slug)),
    [allProducts, slugs],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      slugs,
      products,
      count: slugs.length,
      has: (slug) => slugs.includes(slug),
      toggle: (slug) => {
        setSlugs((current) =>
          current.includes(slug)
            ? current.filter((item) => item !== slug)
            : [...current, slug],
        );
      },
      remove: (slug) => {
        setSlugs((current) => current.filter((item) => item !== slug));
      },
      clear: () => setSlugs([]),
    }),
    [products, slugs],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const value = useContext(WishlistContext);

  if (!value) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return value;
}
