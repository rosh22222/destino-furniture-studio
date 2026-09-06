import { notFound } from "next/navigation";
import Image from "next/image";

import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getBrands, getCategories, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/structured-data";

export const revalidate = 3600;

type CategoryPageProps = {
  params: Promise<{ "category-slug": string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    "category-slug": category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { "category-slug": slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return {};
  }

  return pageMetadata({
    title: category.name,
    description: category.summary,
    path: `/products/${category.slug}`,
    image: category.image,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { "category-slug": slug } = await params;
  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(),
  ]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.categorySlug === category.slug,
  );
  const brandMap = new Map(brands.map((brand) => [brand.slug, brand]));

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          `${category.name} products`,
          categoryProducts.map((product) => ({
            name: product.name,
            href: `/product/${product.slug}`,
          })),
        )}
      />

      <section className="pb-12 text-center">
        <div className="relative flex h-[300px] items-center justify-center overflow-hidden bg-[#F4EFE7] sm:h-[360px] lg:h-[411px]">
          <Image
            alt={`${category.name} category banner`}
            className="object-cover object-center"
            fill
            priority
            sizes="100vw"
            src={category.image}
          />
          <div className="absolute inset-0 bg-white/62" />
          <div className="relative max-w-3xl px-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.45em] text-[#B9854F]">
              Category
            </span>
            <h1 className="mt-5 [font-family:var(--font-collection-heading)] text-5xl font-extrabold uppercase leading-none tracking-[0.04em] text-[#026670] sm:text-6xl lg:text-7xl">
              {category.name}
            </h1>
            <p className="mt-2 text-4xl font-light italic leading-tight text-[#77746F] sm:text-5xl lg:text-6xl">
              & Collections.
            </p>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#4F5E5A]">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Available ranges"
            title={`${category.name} for enquiry and quotation`}
          >
            <p>
              Specifications, model numbers, dimensions, finishes and brochures
              appear only when verified records are published.
            </p>
          </SectionHeading>

          {categoryProducts.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product, index) => (
                <ProductCard
                  brand={
                    product.brandSlug ? brandMap.get(product.brandSlug) : undefined
                  }
                  category={category}
                  key={product.slug}
                  priority={index < 3}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-8">
              <h2 className="text-xl font-semibold text-[#202238]">
                Products for this category are being curated
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#625f5a]">
                Contact Destino with the requirement and the team can respond
                with available options.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
