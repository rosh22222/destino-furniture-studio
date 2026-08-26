"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ConsentAnalytics } from "@/components/consent-analytics";
import { FloatingContact } from "@/components/floating-contact";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WishlistProvider } from "@/components/wishlist-provider";
import type { Category, Location, Product } from "@/lib/types";

export function SiteChrome({
  children,
  categories,
  locations,
  products,
}: {
  children: ReactNode;
  categories: Category[];
  locations: Location[];
  products: Product[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <WishlistProvider allProducts={products}>
      <Header categories={categories} products={products} />
      <main id="main-content">{children}</main>
      <Footer categories={categories} locations={locations} />
      <FloatingContact />
      <ConsentAnalytics />
    </WishlistProvider>
  );
}

