import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig, confirmationItems } from "@/lib/constants";
import { getBrands, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "About",
  description:
    "Learn about Destino Furniture Studio, a unit of Manidivya Enterprises, serving furniture buyers in Visakhapatnam, Kakinada and Bengaluru.",
  path: "/about",
  image: "/legacy/image%20(1)-w08GJtF5.jpeg",
});

export default async function AboutPage() {
  const [brands, projects] = await Promise.all([getBrands(), getProjects()]);

  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "About", href: "/about" }]}
        eyebrow="About"
        image="/legacy/image%20(1)-w08GJtF5.jpeg"
        title="A furniture studio built for guided commercial buying"
      >
        <p>
          {siteConfig.name} is a unit of {siteConfig.parentCompany}, supporting
          office, custom, institutional, restaurant and domestic furniture
          enquiries across verified city locations.
        </p>
      </PageHero>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <SectionHeading
            eyebrow="Approach"
            title="Clear product discovery before quotation"
          >
            <p>
              The Destino website is designed as a catalogue and enquiry system,
              not a generic online store. Product prices, ratings, awards and
              claims are only published after the business confirms them.
            </p>
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Furniture categories and real project records stay easy to browse.",
              "Customers can save products locally and request one combined quote.",
              "Product pages hide missing specs cleanly instead of filling them with assumptions.",
              "The admin panel is ready for confirmed product data, redirects, SEO and media.",
            ].map((item) => (
              <div
                className="flex gap-3 rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5"
                key={item}
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 flex-none text-[#C56545]"
                />
                <p className="text-sm leading-6 text-[#625f5a]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1EA] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="relative min-h-96 overflow-hidden rounded-lg border border-[#DED7CF] bg-[#202238]">
              <Image
                alt="Destino project furniture installation"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 50vw, 92vw"
                src="/legacy/image%20(1)-D1OB4ju4.jpeg"
              />
            </div>
            <div className="self-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
                Portfolio proof
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#202238]">
                {projects.length} project records and {brands.length} channel
                partners are ready in the new structure.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#625f5a]">
                Existing project names and photographs have been preserved while
                the visual presentation, URLs and content model have been
                rebuilt for cleaner browsing.
              </p>
              <Link
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-5 text-sm font-semibold text-white hover:bg-[#C56545]"
                href="/projects"
              >
                View projects
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Confirmation needed"
            title="Information intentionally left admin-managed"
          >
            <p>
              The following items should be confirmed by the business before
              they are published as public facts.
            </p>
          </SectionHeading>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {confirmationItems.map((item) => (
              <div
                className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-4 text-sm text-[#625f5a]"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
