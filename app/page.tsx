import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Sofa,
  Sparkles,
  Table2,
} from "lucide-react";

import { HeroCarousel, type HeroCarouselSlide } from "@/components/hero-carousel";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { LogoCloud } from "@/components/logo-cloud";
import { ProductCard } from "@/components/product-card";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import {
  getBrands,
  getCategories,
  getClients,
  getProducts,
  getProjects,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import type { Brand, Category } from "@/lib/types";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Office, Custom and Commercial Furniture",
  description:
    "Destino Furniture Studio offers office furniture, ergonomic chairs, custom furniture and commercial furniture planning across Visakhapatnam, Kakinada and Bengaluru.",
  path: "/",
});

const heroSlides: HeroCarouselSlide[] = [
  {
    src: "/images/hero/pastry-chef-office-lounge.jpeg",
    alt: "Premium office furniture project by Destino Furniture Studio",
    label: "office furniture project",
  },
  {
    src: "/images/hero/spl-logistics-workstations.jpeg",
    alt: "Modern workstation furniture installation by Destino Furniture Studio",
    label: "workstation installation",
  },
  {
    src: "/images/hero/tarnika-corporate-office.jpeg",
    alt: "Custom commercial furniture completed by Destino Furniture Studio",
    label: "custom commercial furniture",
  },
  {
    src: "/images/hero/hospitality-furniture.jpeg",
    alt: "Restaurant and hospitality furniture project by Destino Furniture Studio",
    label: "hospitality furniture project",
  },
];

const showcaseBanners = [
  {
    title: "Premium seating crafted for calm, comfortable spaces",
    subtitle:
      "A refined lounge and visitor seating presentation for offices, waiting areas and hospitality corners.",
    image: "/images/home-showcase/soft-seating-banner.jpeg",
    alt: "Premium seating display for Destino Furniture Studio",
    href: "/product/lounge-and-visitor-seating",
    cta: "Explore Seating",
    accent: "#202238",
    features: [
      {
        icon: Sofa,
        title: "Comfort-first upholstery",
      },
      {
        icon: ShieldCheck,
        title: "Project-grade structure",
      },
    ],
  },
  {
    title: "Revamp dining and cafeteria areas with polished furniture sets",
    subtitle:
      "Plan dining, restaurant and cafeteria furniture with coordinated seating, table sizes and refined finishes.",
    image: "/images/home-showcase/dining-banner.jpeg",
    alt: "Dining and cafeteria furniture display for Destino Furniture Studio",
    href: "/products/restaurant-furniture",
    cta: "Explore Dining",
    accent: "#9A6A45",
    features: [
      {
        icon: Table2,
        title: "Coordinated table sets",
      },
      {
        icon: Sparkles,
        title: "Refined finish options",
      },
    ],
  },
];

function categoryBySlug(categories: Category[]) {
  return new Map(categories.map((category) => [category.slug, category]));
}

function brandBySlug(brands: Brand[]) {
  return new Map(brands.map((brand) => [brand.slug, brand]));
}

export default async function Home() {
  const [categories, brands, products, projects, clients] =
    await Promise.all([
      getCategories(),
      getBrands(),
      getProducts(),
      getProjects(),
      getClients(),
    ]);

  const categoryMap = categoryBySlug(categories);
  const brandMap = brandBySlug(brands);
  const featuredCategories = categories.filter((category) => category.featured);
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 6);
  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 4);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <section className="relative min-h-[min(760px,calc(100svh-8rem))] overflow-hidden bg-[#202238] text-white md:min-h-[min(880px,calc(100svh-8rem))]">
        <HeroCarousel slides={heroSlides} />
        <div className="relative z-30 mx-auto flex min-h-[min(760px,calc(100svh-8rem))] max-w-7xl items-center px-4 py-16 sm:px-6 md:min-h-[min(880px,calc(100svh-8rem))] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5F1EA]">
              A Unit of Manidivya Enterprises
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Office, custom and commercial furniture for real projects.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#F5F1EA]">
              Destino Furniture Studio helps buyers plan ergonomic chairs,
              workstations, office tables, customized furniture and commercial
              interiors across Visakhapatnam, Kakinada and Bengaluru.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-[#FCFBF8] px-5 text-sm font-semibold text-[#202238] transition hover:bg-[#F5F1EA]"
                href="/products"
              >
                Explore Products
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] border border-white/55 px-5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                href="/contact#quote"
              >
                Request a Quote
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 md:py-10">
        <div className="mx-auto max-w-[1560px] space-y-8 px-4 sm:px-6 lg:px-8">
          {showcaseBanners.map((banner, index) => (
            <article
              className="group relative min-h-[430px] overflow-hidden rounded-lg border border-[#DED7CF] bg-[#FCFBF8] md:min-h-[390px]"
              key={banner.title}
            >
              <Image
                alt={banner.alt}
                className="object-cover transition duration-500 group-hover:scale-[1.015]"
                fill
                priority={index === 0}
                sizes="(min-width: 1280px) 1500px, 100vw"
                src={banner.image}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/12 md:via-white/78" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/78 via-transparent to-transparent md:hidden" />
              <div className="relative z-10 flex min-h-[430px] max-w-2xl flex-col justify-center px-6 py-10 sm:px-10 md:min-h-[390px] lg:px-16">
                <h2
                  className="max-w-2xl text-4xl leading-tight text-[#111111] sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {banner.title}
                </h2>
                <div
                  className="mt-5 h-1 w-36"
                  style={{ backgroundColor: banner.accent }}
                />
                <p className="mt-5 max-w-xl text-xl leading-8 text-[#29282D] sm:text-2xl">
                  {banner.subtitle}
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  {banner.features.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <div className="flex items-center gap-3" key={feature.title}>
                        <span className="inline-flex h-14 w-14 flex-none items-center justify-center rounded-full bg-black text-white">
                          <Icon aria-hidden="true" className="h-7 w-7" />
                        </span>
                        <span className="max-w-36 text-sm font-semibold leading-5 text-[#111111]">
                          {feature.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-[4px] px-5 text-base font-semibold text-white transition hover:opacity-90"
                    href={banner.href}
                    style={{ backgroundColor: banner.accent }}
                  >
                    {banner.cta}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#FCFBF8] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Catalogue"
              title="Furniture categories built around real buying needs"
            >
              <p>
                Explore office, institutional, restaurant, domestic and custom
                furniture categories with enquiry-first product pages.
              </p>
            </SectionHeading>
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] hover:text-[#202238]"
              href="/products"
            >
              View all products{" "}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((category, index) => (
              <Link
                className="group relative min-h-72 overflow-hidden rounded-lg border border-[#DED7CF] bg-[#F5F1EA]"
                href={`/products/${category.slug}`}
                key={category.slug}
              >
                <Image
                  alt={`${category.name} by Destino Furniture Studio`}
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  fill
                  priority={index < 2}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                  src={category.image}
                />
                <div className="absolute inset-0 bg-[#202238]/34" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#F5F1EA]">
                    {category.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1EA] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Featured products"
            title="Quote-ready ranges without fake prices"
          >
            <p>
              Product pages support model numbers, dimensions, finishes,
              brochures and galleries as soon as verified records are added in
              the admin panel.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
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
      </section>

      <section className="bg-[#202238] py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Projects"
              tone="inverse"
              title="Selected completed project records"
            >
              <p className="text-[#DED7CF]">
                Real project photographs from the existing Destino portfolio are
                preserved as professional case-study pages.
              </p>
            </SectionHeading>
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5F1EA] hover:text-white"
              href="/projects"
            >
              View all projects{" "}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                priority={index < 2}
                project={project}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FCFBF8] py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <SectionHeading
            eyebrow="Why Destino"
            title="Quiet guidance for furniture decisions that need to hold up"
          >
            <p>
              The site avoids checkout and unverified pricing because furniture
              decisions depend on models, quantities, finishes, delivery scope
              and site context.
            </p>
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Verified categories and project records are preserved.",
              "Wishlist and multi-product quotation flows reduce back-and-forth.",
              "Admin-managed fields keep claims, specs and SEO editable.",
              "Partner brands HOF, Spacewood and Paradise are clearly represented.",
            ].map((item) => (
              <div
                className="flex gap-3 rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-4"
                key={item}
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 flex-none text-[#C56545]"
                />
                <p className="text-sm leading-6 text-[#29282D]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1EA] py-16 md:py-20">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          <div>
            <SectionHeading
              align="center"
              eyebrow="Channel partners"
              title="Partner brands"
            />
            <div className="mx-auto mt-8 max-w-4xl">
              <LogoCloud items={brands} />
            </div>
          </div>
          <div>
            <SectionHeading
              align="center"
              eyebrow="Clients"
              title="Organizations represented in the Destino portfolio"
            />
            <div className="mt-8">
              <LogoCloud items={clients.slice(0, 12)} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#202238] py-16 md:py-20" id="quote">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1fr] lg:px-8">
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
              Consultation
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
              Share a product list, project room or custom furniture brief.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#DED7CF]">
              The Destino team can respond by phone, email or WhatsApp with the
              next step for a verified quotation.
            </p>
          </div>
          <LeadForm intent="quote" sourcePath="/" title="Request a quotation" />
        </div>
      </section>
    </>
  );
}
