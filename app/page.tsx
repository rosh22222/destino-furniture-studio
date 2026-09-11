import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ClipboardList,
  Handshake,
  Settings2,
} from "lucide-react";

import hero1 from "../public/images/hero/hero1.png";
import hero2 from "../public/images/hero/hero2.png";
import hero3 from "../public/images/hero/hero3.png";
import hero4 from "../public/images/hero/hero4.png";
import hero5 from "../public/images/hero/hero5.png";
import hero6 from "../public/images/hero/hero6.png";
import hero7 from "../public/images/hero/hero7.png";
import hero8 from "../public/images/hero/hero8.png";
import { HeroCarousel, type HeroCarouselSlide } from "@/components/hero-carousel";
import { ColourVariantsShowcase } from "@/components/colour-variants-showcase";
import { JsonLd } from "@/components/json-ld";
import { ConsultationModal } from "@/components/consultation-modal";
import { LogoCloud } from "@/components/logo-cloud";
import { TestimonialsSection } from "@/components/testimonials-section";
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
    alt: "Destino Furniture Studio Hero Image 1",
    label: "hero image 1",
  },
  {
    src: hero2,
    alt: "Destino Furniture Studio Hero Image 2",
    label: "hero image 2",
  },
  {
    src: hero3,
    alt: "Destino Furniture Studio Hero Image 3",
    label: "hero image 3",
  },
  {
    src: hero4,
    alt: "Destino Furniture Studio Hero Image 4",
    label: "hero image 4",
  },
  {
    src: hero5,
    alt: "Destino Furniture Studio Hero Image 5",
    label: "hero image 5",
  },
  {
    src: hero6,
    alt: "Destino Furniture Studio Hero Image 6",
    label: "hero image 6",
  },
  {
    src: hero7,
    alt: "Destino Furniture Studio Hero Image 7",
    label: "hero image 7",
  },
  {
    src: hero8,
    alt: "Destino Furniture Studio Hero Image 8",
    label: "hero image 8",
  },
];

const homeCategories = [
  {
    title: "Ergonomic Chairs",
    href: "/products/ergonomic-chairs",
    image: "/images/products/chairs/ergonomic/img1.png",
  },
  {
    title: "Office Chairs",
    href: "/products/office-chairs",
    image: "/images/categories/office-chair.png",
  },
  {
    title: "Office Tables",
    href: "/products/office-tables",
    image: "/images/products/tables/office-tables/office-table.png",
  },
  {
    title: "Cafeteria Chairs",
    href: "/products/cafeteria-chairs",
    image: "/images/products/chairs/cafeteria/chair34.png",
  },
  {
    title: "Workstation Tables",
    href: "/products?type=Tables&category=workstation-tables-and-chairs",
    image: "/images/products/tables/workstation/work1.png",
  },
  {
    title: "Workstation Chairs",
    href: "/products?type=Chairs&category=workstation-chairs",
    image: "/images/products/chairs/workstation/img1.png",
  },
  {
    title: "Wood Collection",
    href: "/products/customized-furniture",
    image: "/images/categories/wood-collection/wood1.png",
  },
  {
    title: "Office Turnkey Interiors",
    href: "/products/office-interiors",
    image: "/images/categories/office-interiors/interior1.png",
  },
  {
    title: "Storage Units",
    href: "/products/storage-units",
    image: "/images/products/storage/storage1.png",
  },
  {
    title: "Metal Series",
    href: "/products/metal-series",
    image: "/images/products/metal-series/metal1.png",
  },
  {
    title: "Banquet Chairs",
    href: "/products/banquet-chairs",
    image: "/images/categories/banquet/banquet1.png",
  },
  {
    title: "Cafeteria Tables",
    href: "/products/cafeteria-tables",
    image: "/images/products/tables/cafeteria-tables/img1.png",
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

const ourCollectionItems = [
  {
    title: "VISITORS",
    href: "/product/lounge-and-visitor-seating",
    image: "/images/collection/visitors1.png",
  },
  {
    title: "TABLE",
    href: "/products?type=Tables",
    image: "/images/collection/table.png",
  },
  {
    title: "BARSTOOL",
    href: "/products?type=Chairs",
    image: "/images/collection/barstool.png",
  },
  {
    title: "EXECUTIVE",
    href: "/products?type=Chairs",
    image: "/images/collection/executive.png",
  },
  {
    title: "CAFE CHAIRS",
    href: "/products/cafeteria-furniture",
    image: "/images/collection/cafe-chair.png",
  },
  {
    title: "RECLINER",
    href: "/products?type=Recliners",
    image: "/images/collection/recliner.png",
  },
  {
    title: "WORKSTATION",
    href: "/products?type=Workstations",
    image: "/images/collection/workstation.png",
  },
  {
    title: "LOUNGE",
    href: "/product/lounge-and-visitor-seating",
    image: "/images/collection/longue.png",
  },
  {
    title: "MULTISEATERS",
    href: "/products?type=Sofas",
    image: "/images/collection/multiseater.png",
  },
];

const newArrivalsItems = [
  {
    title: "Aero Mesh Task",
    subtitle: "AERO-MT-01",
    image: "/images/new-arrivals/new1.png",
  },
  {
    title: "ErgoPro Headrest",
    subtitle: "ERGO-PRO-02",
    image: "/images/new-arrivals/new2.png",
  },
  {
    title: "Flexi Lumbar Mesh",
    subtitle: "FLEXI-LM-03",
    image: "/images/new-arrivals/new3.png",
  },
  {
    title: "Contour Ergonomic",
    subtitle: "CONTOUR-ERGO-04",
    image: "/images/new-arrivals/new4.png",
  },
  {
    title: "Luxe Executive",
    subtitle: "LUXE-EXEC-05",
    image: "/images/new-arrivals/new5.png",
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
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mb-10 text-left">
            <h2 className="[font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase leading-none tracking-[0.04em] text-[#026670] sm:text-5xl md:text-6xl">
              CATEGORIES
            </h2>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-[#4F4B4A] sm:text-lg">
              Discover a refined selection created to enhance modern spaces with thoughtful design, lasting quality, and effortless elegance. Each piece is made to deliver a balanced blend of style, comfort, and everyday functionality.
            </p>
            <Link
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] transition-colors hover:text-[#202238]"
              href="/products"
            >
              View all products{" "}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <div className="mt-4 h-0.5 w-20 bg-[#C56545]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeCategories.map((category) => (
              <Link
                className="group relative min-h-72 overflow-hidden rounded-lg border border-[#DED7CF] bg-[#F8F5EF] shadow-[0_14px_42px_rgba(32,34,56,0.08)]"
                href={category.href}
                key={category.title}
              >
                <Image
                  alt={category.title + " by Destino Furniture Studio"}
                  className="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
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

      <section className="overflow-hidden bg-white py-16 md:py-20">
        <div className="mb-10 px-4 text-left sm:px-6 lg:px-12 xl:px-24">
          <h2 className="[font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase leading-none tracking-[0.04em] text-[#026670] sm:text-5xl md:text-6xl">
            OUR COLLECTION
          </h2>
          <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-[#4F4B4A] sm:text-lg">
            Distinct designs. Exceptional comfort. Purposeful functionality.
            <br />
            Explore the Destino collection crafted to elevate every space.
          </p>
          <div className="mt-4 h-0.5 w-20 bg-[#C56545]" />
        </div>
        
        <div className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 sm:px-6 lg:px-12 xl:px-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ourCollectionItems.map((item, idx) => (
            <Link
              className="group flex w-[260px] shrink-0 snap-start flex-col sm:w-[300px] lg:w-[340px]"
              href={item.href}
              key={idx}
            >
              <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-lg border border-[#E6DDD1] bg-white shadow-[0_16px_45px_rgba(32,34,56,0.08)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_55px_rgba(2,102,112,0.14)]">
                <span className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#026670] shadow-sm">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                <div className="absolute inset-0">
                  <Image
                    alt={item.title}
                    className="object-contain p-3 transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
                    fill
                    sizes="(min-width: 1024px) 340px, (min-width: 640px) 300px, 260px"
                    src={item.image}
                  />
                </div>
              </div>
              <div className="px-2 pt-1 text-center">
                <h3 className="text-lg font-extrabold tracking-[0.12em] text-[#026670] transition-colors group-hover:text-[#202238]">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ColourVariantsShowcase />

      <section className="bg-[#FCFBF8] py-16 md:py-20 overflow-hidden">
        <div className="mb-10 px-4 text-left sm:px-6 lg:px-12 xl:px-24">
          <h2 className="[font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase leading-none tracking-[0.04em] text-[#026670] sm:text-5xl md:text-6xl">
            NEW ARRIVALS
          </h2>
          <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-[#4F4B4A] sm:text-lg">
            Explore our latest furniture arrivals, crafted to make every space feel fresh, functional and distinctly premium.
          </p>
          <div className="mt-4 h-0.5 w-20 bg-[#C56545]" />
        </div>
        
        <div className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 sm:px-6 lg:px-12 xl:px-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {newArrivalsItems.map((item, idx) => (
            <div 
              className="group flex w-[280px] shrink-0 snap-start cursor-pointer flex-col sm:w-[320px] lg:w-[380px]" 
              key={idx}
            >
              <div className="relative mb-5 aspect-square w-full overflow-hidden rounded-3xl bg-[#F5F5F5]">
                <span className="absolute left-6 top-6 z-10 rounded-full bg-[#126872] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                  New
                </span>
                <div className="absolute inset-8 sm:inset-10">
                  <Image
                    alt={item.title}
                    className="object-contain mix-blend-multiply transition-transform duration-500 ease-in-out group-hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 320px, 280px"
                    src={item.image}
                  />
                </div>
              </div>
              <div className="flex flex-col pt-2 px-2">
                <h3 className="text-xl font-bold text-[#126872] transition-colors group-hover:text-[#202238]">
                  {item.title}
                </h3>
                <span className="mt-1.5 text-sm font-bold tracking-wider text-[#8C8C8C] uppercase">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F7F3ED] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-base font-bold uppercase tracking-[0.16em] text-[#C56545]">
            Why Destino
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-normal italic leading-tight text-[#1E3A8A] md:text-4xl">
            Furniture guidance that keeps every detail clear.
          </h2>
          <div className="mx-auto mt-5 h-0.5 w-24 bg-[#C56545]" />
          <div className="mx-auto mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyDestinoItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="flex flex-col items-center text-center px-4"
                  key={item.text}
                >
                  <span className="flex h-16 w-16 items-center justify-center text-[#202238]">
                    <Icon aria-hidden="true" className="h-12 w-12 stroke-[2]" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold leading-tight text-[#202238]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-[#4F4B4A]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1EA] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base font-bold uppercase tracking-[0.16em] text-[#C56545]">
              Channel partners
            </p>
            <h2 className="mt-3 [font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase leading-none tracking-[0.04em] text-[#026670] sm:text-5xl md:text-6xl">
              PARTNER BRANDS
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-20 bg-[#C56545]" />
          </div>
          <div className="mx-auto mt-8 max-w-6xl">
            <LogoCloud items={brands} variant="partners" />
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden bg-[#FFF3E0] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-base font-bold uppercase tracking-[0.16em] text-[#C56545]">
            Trusted By
          </p>
          <h2 className="mt-3 [font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase leading-none tracking-[0.04em] text-[#026670] sm:text-5xl md:text-6xl">
            OUR CLIENTS
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-[#C56545]" />
        </div>
        <div className="mt-14">
          <LogoCloud items={clients} variant="marquee" />
        </div>
      </section>

      <TestimonialsSection />

      <ConsultationModal />
    </>
  );
}
