import Image from "next/image";
import Link from "next/link";


import { ProductCard } from "@/components/product-card";
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

const productTypeFilters = [
  { label: "Chairs", value: "Chairs" },
  { label: "Workstations", value: "Workstations" },
  { label: "Tables", value: "Tables" },
  { label: "Storage", value: "Storage" },
  { label: "Recliners", value: "Recliners" },
  { label: "Swings", value: "Swings" },
  { label: "Sofas", value: "Sofas" },
  { label: "Customized", value: "Customized" },
];

const standardProductTypes = productTypeFilters
  .map((type) => type.value)
  .filter((type) => type !== "Customized");

function matchesType(product: { furnitureType: string; slug: string }, filterType: string) {
  if (filterType === "Customized") {
    return (
      product.slug !== "lounge-and-visitor-seating" &&
      !standardProductTypes.includes(product.furnitureType)
    );
  }

  return product.furnitureType === filterType;
}

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
    image: "/images/pages/products/product-hero-banner.png",
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
  const visibleProducts = filteredProducts;
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const brandMap = new Map(brands.map((brand) => [brand.slug, brand]));
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


      <section className="text-center">
        <div className="relative flex h-[300px] items-center justify-center overflow-hidden bg-[#F4EFE7] sm:h-[360px] lg:h-[411px]">
          <Image
            alt="Destino furniture products banner"
            className="object-cover object-center"
            fill
            priority
            src="/images/pages/products/product-hero-banner.png"
          />
          <div className="absolute inset-0 bg-white/62" />
          <div className="relative max-w-3xl px-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.45em] text-[#B9854F]">
              Product catalogue
            </span>
            <h1 className="mt-5 [font-family:var(--font-collection-heading)] text-5xl font-extrabold uppercase leading-none tracking-[0.04em] text-[#026670] sm:text-6xl lg:text-7xl">
              PRODUCTS
            </h1>
            <p className="mt-2 text-4xl font-light italic leading-tight text-[#77746F] sm:text-5xl lg:text-6xl">
              & Collections.
            </p>
            <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-8 text-[#4F5E5A] sm:text-xl">
              Explore seating, workstations, tables, storage, sofas and custom
              furniture ranges curated for premium workspaces.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-[#202238]">Product Types:</span>
            <Link
              href="/products"
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                filters.type
                  ? "bg-[#F5F1EA] text-[#4F4B4A] hover:bg-[#C56545] hover:text-white"
                  : "bg-[#1E3A8A] text-white"
              }`}
            >
              All
            </Link>
            {productTypeFilters.map((type) => {
              const isActive = filters.type === type.value;
              return (
                <Link
                  key={type.value}
                  href={`/products?type=${encodeURIComponent(type.value)}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-[#1E3A8A] text-white"
                      : "bg-[#F5F1EA] text-[#4F4B4A] hover:bg-[#C56545] hover:text-white"
                  }`}
                >
                  {type.label}
                </Link>
              );
            })}
          </div>



          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
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
            <div className="space-y-16">
              {(() => {
                const mainTypes = productTypeFilters;
                
                const renderedMain = mainTypes.map((type) => {
                  const productsOfType = visibleProducts.filter(
                    (product) => matchesType(product, type.value)
                  );
                  if (productsOfType.length === 0) return null;
                  
                  return (
                    <div key={type.value} className="space-y-6">
                      <h2 className="[font-family:var(--font-collection-heading)] text-2xl font-extrabold uppercase tracking-[0.04em] text-[#026670] border-b border-[#DED7CF] pb-2">
                        {type.label}
                      </h2>
                      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {productsOfType.map((product, index) => (
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
                    </div>
                  );
                });

                return renderedMain;
              })()}
            </div>
          ) : (
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-8 text-center">
              <h2 className="[font-family:var(--font-collection-heading)] text-xl font-extrabold uppercase tracking-[0.04em] text-[#026670]">
                No matching products
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#625f5a]">
                Try a broader search or contact Destino with your furniture
                requirement. The admin catalogue can publish more products as
                SKU-level information is confirmed.
              </p>
            </div>
          )}


        </div>
      </section>
    </>
  );
}
