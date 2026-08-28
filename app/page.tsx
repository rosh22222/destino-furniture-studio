import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Handshake,
  Settings2,
} from "lucide-react";

import hero1 from "../public/images/hero/hero1.png";
import { HeroCarousel, type HeroCarouselSlide } from "@/components/hero-carousel";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { LogoCloud } from "@/components/logo-cloud";
import { SectionHeading } from "@/components/section-heading";
import { getBrands, getClients } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Office, Custom and Commercial Furniture",
  description:
    "Destino Furniture Studio offers office furniture, ergonomic chairs, custom furniture and commercial furniture planning across Visakhapatnam, Kakinada and Bengaluru.",
  path: "/",
});

const heroSlides: HeroCarouselSlide[] = [
  {
    src: hero1,
    alt: "Destino Furniture Studio Hero Image",
    label: "hero image",
  },
];

const homeCategories = [
  {
    title: "Ergonomic Chairs",
    href: "/products/ergonomic-chairs",
    image: "/images/categories/ergonomic-chairs/cover.jpeg",
  },
  {
    title: "Office Chairs",
    href: "/products/office-chairs",
    image: "/images/categories/office-chairs/cover.jpeg",
  },
  {
    title: "Office Tables",
    href: "/products/office-tables",
    image: "/images/categories/office-tables/cover.jpeg",
  },
  {
    title: "Cafeteria Chairs",
    href: "/products/cafeteria-furniture",
    image: "/images/categories/cafeteria-furniture/cover.jpeg",
  },
  {
    title: "Workstation Tables",
    href: "/product/workstation-table-system",
    image: "/images/products/workstation-table-system/cover.jpeg",
  },
  {
    title: "Workstation Chairs",
    href: "/products/workstation-tables-and-chairs",
    image: "/images/categories/workstation-tables-and-chairs/cover.jpeg",
  },
  {
    title: "Wood Collection",
    href: "/product/custom-storage-and-cabinetry",
    image: "/images/products/custom-storage-and-cabinetry/cover.jpeg",
  },
  {
    title: "Office Turnkey Interiors",
    href: "/product/office-interior-turnkey-furniture",
    image: "/images/products/office-interior-turnkey-furniture/cover.jpeg",
  },
];

const whyDestinoItems = [
  {
    icon: BadgeCheck,
    title: "Verified Records",
    text: "Verified categories and product records are preserved.",
  },
  {
    icon: ClipboardList,
    title: "Quotation Flow",
    text: "Wishlist and multi-product quotation flows reduce back-and-forth.",
  },
  {
    icon: Settings2,
    title: "Editable Details",
    text: "Admin-managed fields keep claims, specs and SEO editable.",
  },
  {
    icon: Handshake,
    title: "Partner Brands",
    text: "Partner brands HOF, Spacewood and Paradise are clearly represented.",
  },
];

export default async function Home() {
  const [brands, clients] = await Promise.all([getBrands(), getClients()]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <section className="relative w-full overflow-hidden bg-[#FCFBF8]">
        <HeroCarousel slides={heroSlides} />
      </section>

      <section className="bg-[#FBF8F3] px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        <div className="mx-auto max-w-[1560px] overflow-hidden rounded-lg border border-[#E6DDD1] bg-[#F7F0E8] shadow-[0_22px_70px_rgba(32,34,56,0.10)]">
          <Image
            alt="Premium cosy chair seating banner for Destino Furniture Studio"
            className="h-auto w-full"
            height={917}
            priority
            quality={100}
            sizes="(min-width: 1280px) 1500px, 100vw"
            src="/images/home-showcase/cosy-chair.png"
            unoptimized
            width={2048}
          />
        </div>
      </section>

      <section className="bg-[#FCFBF8] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold leading-tight text-[#202238] sm:text-4xl">
              Categories
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-20 bg-[#C56545]" />
            <Link
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] hover:text-[#202238]"
              href="/products"
            >
              View all products{" "}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeCategories.map((category) => (
              <Link
                className="group relative min-h-64 overflow-hidden rounded-lg border border-[#DED7CF] bg-[#F5F1EA] shadow-[0_14px_42px_rgba(32,34,56,0.08)]"
                href={category.href}
                key={category.title}
              >
                <Image
                  alt={`${category.title} by Destino Furniture Studio`}
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  fill
                  priority
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 92vw"
                  src={category.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#202238]/72 via-[#202238]/18 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-center text-white">
                  <h3 className="text-xl font-bold leading-tight">
                    {category.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F3ED] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C56545]">
            Why Destino
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight text-[#202238] md:text-4xl">
            Furniture guidance that keeps every detail clear.
          </h2>
          <div className="mx-auto mt-5 h-0.5 w-24 bg-[#C56545]" />
          <div className="mx-auto mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyDestinoItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="flex min-h-72 flex-col items-center justify-center rounded-lg bg-white px-6 py-9 shadow-[0_18px_55px_rgba(32,34,56,0.08)]"
                  key={item.text}
                >
                  <span className="flex h-24 w-24 items-center justify-center text-[#164C46]">
                    <Icon aria-hidden="true" className="h-16 w-16 stroke-[1.7]" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold leading-tight text-[#164C46]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base font-medium leading-7 text-[#4F4B4A]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1EA] py-16 md:py-20">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C56545]">
                Channel partners
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[#202238] md:text-4xl">
                Partner brands
              </h2>
              <div className="mx-auto mt-4 h-0.5 w-20 bg-[#C56545]" />
            </div>
            <div className="mx-auto mt-8 max-w-5xl">
              <LogoCloud items={brands} variant="partners" />
            </div>
          </div>
          <div>
            <SectionHeading
              align="center"
              eyebrow="Clients"
              title="Organizations represented in the Destino portfolio"
            />
            <div className="mt-8">
              <LogoCloud items={clients} variant="marquee" />
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
