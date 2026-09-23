"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import type { Brand, Category, Product } from "@/lib/types";

export function ProductTitleSearch({
  brands,
  categories,
  products,
}: {
  brands: Brand[];
  categories: Category[];
  products: Product[];
}) {
  const [query, setQuery] = useState("");
  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.slug, category])),
    [categories],
  );
  const brandMap = useMemo(
    () => new Map(brands.map((brand) => [brand.slug, brand])),
    [brands],
  );
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return [];
    }

    return products
      .filter((product) => product.name.toLowerCase().includes(value))
      .slice(0, 12);
  }, [products, query]);

  return (
    <div className="rounded-2xl border border-[#DED7CF] bg-white p-4 shadow-[0_18px_45px_rgba(32,34,56,0.06)]">
      <label className="space-y-2 text-sm font-extrabold text-[#1E3A8A]">
        Search product by title
        <div className="flex h-12 items-center gap-3 rounded-full border border-[#D9E4E2] bg-[#FCFBF8] px-4">
          <Search aria-hidden="true" className="h-5 w-5 text-[#026670]" />
          <input
            className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[#1E3A8A] outline-none placeholder:text-[#76827F]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type product name, chair, table..."
            type="search"
            value={query}
          />
        </div>
      </label>

      {query.trim() ? (
        <div className="mt-5 space-y-4">
          <p className="text-sm font-semibold text-[#4F5E5A]">
            Showing {matches.length} matching product{matches.length === 1 ? "" : "s"}
          </p>
          {matches.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((product) => (
                <ProductCard
                  brand={
                    product.brandSlug ? brandMap.get(product.brandSlug) : undefined
                  }
                  category={categoryMap.get(product.categorySlug)}
                  key={product.slug}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6 text-center">
              <h2 className="[font-family:var(--font-collection-heading)] text-xl font-extrabold uppercase tracking-[0.04em] text-[#026670]">
                No product title found
              </h2>
              <p className="mt-2 text-sm font-medium leading-6 text-[#4F5E5A]">
                Try another product name or browse the catalogue below.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
