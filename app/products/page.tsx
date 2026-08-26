import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import {
  ProductFilterForm,
  type ProductFilters,
} from "@/components/product-filter-form";
import { SectionHeading } from "@/components/section-heading";
import { getBrands, getCategories, getProducts } from "@/lib/content";
import {
  filterProducts,
  hasActiveProductFilters,
  normalizeProductFilters,
} from "@/lib/product-filtering";
import { pageMetadata } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 3600;

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: ProductsPageProps) {
  const filters = normalizeProductFilters(await searchParams);

  return pageMetadata({
    title: "Product Catalogue",
    description:
      "Search and filter office furniture, ergonomic chairs, office tables, cafeteria furniture and custom furniture ranges from Destino Furniture Studio.",
    path: "/products",
    noIndex: hasActiveProductFilters(filters),
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(),
  ]);
  const filters = normalizeProductFilters(await searchParams);
  const filteredProducts = filterProducts(products, filters);
  const pageSize = 9;
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(filters.page, pageCount);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const brandMap = new Map(brands.map((brand) => [brand.slug, brand]));
  const types = [...new Set(products.map((product) => product.furnitureType))].sort();
  const queryBase = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (key === "page" || !value || value === "featured") {
      return;
    }
    queryBase.set(key, String(value));
  });

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          "Destino Furniture Studio product catalogue",
          visibleProducts.map((product) => ({
            name: product.name,
            href: `/product/${product.slug}`,
          })),
        )}
      />
      <section className="bg-[#F5F1EA]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ name: "Products", href: "/products" }]} />
          <div className="mt-8">
            <SectionHeading
              eyebrow="Products"
              title="Furniture catalogue for quotation-led buying"
            >
              <p>
                Search by furniture type, category or partner brand. Product
                pages hide unverified specs and keep quotation requests clear.
              </p>
            </SectionHeading>
          </div>
        </div>
      </section>

      <section className="bg-[#FCFBF8] py-10 md:py-14">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <ProductFilterForm
            brands={brands}
            categories={categories}
            filters={filters as ProductFilters}
            types={types}
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#625f5a]">
              Showing {visibleProducts.length} of {filteredProducts.length} products
            </p>
            {hasActiveProductFilters(filters) ? (
              <Link
                className="text-sm font-semibold text-[#C56545] hover:text-[#202238]"
                href="/products"
              >
                Clear filters
              </Link>
            ) : null}
          </div>

          {visibleProducts.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  brand={
                    product.brandSlug ? brandMap.get(product.brandSlug) : undefined
                  }
                  category={categoryMap.get(product.categorySlug)}
                  key={product.slug}
                  priority={index < 3}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-8 text-center">
              <h2 className="text-xl font-semibold text-[#202238]">
                No matching products
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#625f5a]">
                Try a broader search or contact Destino with your furniture
                requirement. The admin catalogue can publish more products as
                SKU-level information is confirmed.
              </p>
            </div>
          )}

          {pageCount > 1 ? (
            <nav
              aria-label="Product pagination"
              className="flex items-center justify-center gap-3"
            >
              {currentPage > 1 ? (
                <Link
                  className="inline-flex h-11 items-center gap-2 rounded-[4px] border border-[#DED7CF] px-4 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
                  href={`/products?${new URLSearchParams({
                    ...Object.fromEntries(queryBase),
                    page: String(currentPage - 1),
                  })}`}
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Previous
                </Link>
              ) : null}
              <span className="text-sm text-[#625f5a]">
                Page {currentPage} of {pageCount}
              </span>
              {currentPage < pageCount ? (
                <Link
                  className="inline-flex h-11 items-center gap-2 rounded-[4px] border border-[#DED7CF] px-4 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
                  href={`/products?${new URLSearchParams({
                    ...Object.fromEntries(queryBase),
                    page: String(currentPage + 1),
                  })}`}
                >
                  Next
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}

