import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
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
      <PageHero

        eyebrow="Category"
        image={category.image}
        title={category.name}
      >
        <p>{category.description}</p>
      </PageHero>

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
