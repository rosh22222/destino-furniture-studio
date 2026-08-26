import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/constants";
import { getLocations } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/structured-data";
import { whatsappUrl } from "@/lib/whatsapp";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Locations",
  description:
    "Find Destino Furniture Studio location pages for Visakhapatnam, Kakinada and Bengaluru furniture enquiries.",
  path: "/locations",
  image: "/legacy/image%20(1)-D1OB4ju4.jpeg",
});

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          "Destino Furniture Studio locations",
          locations.map((location) => ({
            name: location.name,
            href: `/locations/${location.slug}`,
          })),
        )}
      />
      <PageHero
        breadcrumbs={[{ name: "Locations", href: "/locations" }]}
        eyebrow="Locations"
        image="/legacy/image%20(1)-D1OB4ju4.jpeg"
        title="Furniture enquiry locations"
      >
        <p>
          Verified city locations are Visakhapatnam, Kakinada and Bengaluru.
          Street-level details can be published from admin after confirmation.
        </p>
      </PageHero>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {locations.map((location) => (
            <article
              className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6"
              key={location.slug}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
                {location.region}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#202238]">
                {location.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#625f5a]">
                {location.intro}
              </p>
              <Link
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] hover:text-[#202238]"
                href={`/locations/${location.slug}`}
              >
                View local page
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#F5F1EA] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1fr] lg:px-8">
          <SectionHeading
            eyebrow="Contact"
            title="Use one verified contact set across location pages"
          >
            <p>
              Consistent name, phone and email details reduce local SEO
              confusion while addresses are still being confirmed.
            </p>
          </SectionHeading>
          <div className="grid gap-3 sm:grid-cols-3">
            <a
              className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
              href={`tel:${siteConfig.phoneHref}`}
            >
              <Phone aria-hidden="true" className="mb-3 h-5 w-5 text-[#C56545]" />
              {siteConfig.phoneDisplay}
            </a>
            <a
              className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
              href={whatsappUrl(
                "Hello Destino Furniture Studio, I would like location assistance.",
              )}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle
                aria-hidden="true"
                className="mb-3 h-5 w-5 text-[#C56545]"
              />
              {siteConfig.whatsappDisplay}
            </a>
            <a
              className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
              href={`mailto:${siteConfig.email}`}
            >
              <Mail aria-hidden="true" className="mb-3 h-5 w-5 text-[#C56545]" />
              {siteConfig.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

