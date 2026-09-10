import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, MessageCircle } from "lucide-react";


import { ImageGallery } from "@/components/image-gallery";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { ProductCard } from "@/components/product-card";
import { WishlistButton } from "@/components/wishlist-button";
import { getBrands, getCategories, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { productJsonLd } from "@/lib/structured-data";
import { productWhatsappMessage, whatsappUrl } from "@/lib/whatsapp";

export const revalidate = 3600;

type ProductPageProps = {
  params: Promise<{ "product-slug": string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    "product-slug": product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { "product-slug": slug } = await params;
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return {};
  }

  return pageMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/product/${product.slug}`,
    image: product.image || undefined,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { "product-slug": slug } = await params;
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const category = categories.find((item) => item.slug === product.categorySlug);
  const brand = product.brandSlug
    ? brands.find((item) => item.slug === product.brandSlug)
    : undefined;
  const relatedProducts = products
    .filter((item) => product.relatedSlugs.includes(item.slug))
    .slice(0, 3);


  return (
    <>
      <JsonLd data={productJsonLd(product, category)} />


      <section className="bg-[#FCFBF8] py-10 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#DED7CF] bg-[#F8F5EF]">
              {product.image ? (
                <Image
                  alt={`${product.name} by Destino Furniture Studio`}
                  className="object-contain p-4"
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 92vw"
                  src={product.image}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            {product.gallery?.length > 0 && (
              <ImageGallery
                images={product.gallery.filter((image) => image !== product.image)}
                title={product.name}
              />
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
              {category?.name || "Furniture"} {brand ? `| ${brand.name}` : ""}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#202238] md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#625f5a]">
              {product.shortDescription}
            </p>
            {product.fullDescription ? (
              <p className="mt-4 text-base leading-7 text-[#625f5a]">
                {product.fullDescription}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-5 text-sm font-semibold text-white transition hover:bg-[#C56545]"
                href={whatsappUrl(
                  productWhatsappMessage(product.name, `/product/${product.slug}`),
                )}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp enquiry
              </a>
              <WishlistButton className="h-12" slug={product.slug} />
              {product.brochureUrl ? (
                <a
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] border border-[#DED7CF] px-5 text-sm font-semibold text-[#202238] hover:border-[#C56545] hover:text-[#C56545]"
                  href={product.brochureUrl}
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Brochure
                </a>
              ) : null}
            </div>

            <dl className="mt-8 grid gap-3 rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5 sm:grid-cols-2">
              {[
                ["Furniture type", product.furnitureType],
                ["Category", category?.name],
                ["Brand", brand?.name],
                ["SKU or model", product.sku],
                ["Dimensions", product.dimensions],
              ]
                .filter((item): item is [string, string] => Boolean(item[1]))
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b746e]">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[#202238]">
                      {value}
                    </dd>
                  </div>
                ))}
            </dl>

            {product.features?.length ? (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#202238]">
                  Features
                </h2>
                <ul className="mt-4 grid gap-3">
                  {product.features.map((feature) => (
                    <li
                      className="flex gap-3 text-sm leading-6 text-[#625f5a]"
                      key={feature}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#C56545]"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.materials?.length || product.finishes?.length ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {product.materials?.length ? (
                  <div>
                    <h2 className="text-xl font-semibold text-[#202238]">
                      Materials
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[#625f5a]">
                      {product.materials.join(", ")}
                    </p>
                  </div>
                ) : null}
                {product.finishes?.length ? (
                  <div>
                    <h2 className="text-xl font-semibold text-[#202238]">
                      Finishes
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[#625f5a]">
                      {product.finishes.join(", ")}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1EA] py-12 md:py-16" id="quote">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
              Product quotation
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#202238]">
              Request verified details for this range.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#625f5a]">
              Destino can confirm model-level information, quantity, finishes
              and delivery scope before pricing is shared.
            </p>
          </div>
          <LeadForm
            intent="quote"
            products={[product.name]}
            sourcePath={`/product/${product.slug}`}
            title="Request product quote"
          />
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="bg-[#FCFBF8] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#202238]">
                Related products
              </h2>
              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] hover:text-[#202238]"
                href="/products"
              >
                View catalogue <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((related) => (
                <ProductCard
                  brand={
                    related.brandSlug
                      ? brands.find((item) => item.slug === related.brandSlug)
                      : undefined
                  }
                  category={categories.find(
                    (item) => item.slug === related.categorySlug,
                  )}
                  key={related.slug}
                  product={related}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
