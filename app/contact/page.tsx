import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { LeadForm } from "@/components/lead-form";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/constants";
import { getFaqs, getLocations } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structured-data";
import { whatsappUrl } from "@/lib/whatsapp";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Destino Furniture Studio for office furniture, ergonomic chairs, custom furniture and commercial project quotations.",
  path: "/contact",
  image: "/legacy/image%20(1)-w08GJtF5.jpeg",
});

export default async function ContactPage() {
  const [locations, faqs] = await Promise.all([getLocations(), getFaqs()]);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <PageHero
        breadcrumbs={[{ name: "Contact", href: "/contact" }]}
        eyebrow="Contact"
        image="/legacy/image%20(1)-w08GJtF5.jpeg"
        title="Request a quotation or project consultation"
      >
        <p>
          Share the product range, city, quantities and room context so Destino
          can respond with the right next step.
        </p>
      </PageHero>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1fr] lg:px-8">
          <div className="space-y-5">
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6">
              <h2 className="text-2xl font-semibold text-[#202238]">
                Verified contact details
              </h2>
              <div className="mt-5 space-y-3 text-sm font-semibold text-[#202238]">
                <a
                  className="flex items-center gap-3 hover:text-[#C56545]"
                  href={`tel:${siteConfig.phoneHref}`}
                >
                  <Phone aria-hidden="true" className="h-5 w-5 text-[#C56545]" />
                  {siteConfig.phoneDisplay}
                </a>
                <a
                  className="flex items-center gap-3 hover:text-[#C56545]"
                  href={whatsappUrl(
                    "Hello Destino Furniture Studio, I would like to request a quotation.",
                  )}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle
                    aria-hidden="true"
                    className="h-5 w-5 text-[#C56545]"
                  />
                  {siteConfig.whatsappDisplay}
                </a>
                <a
                  className="flex items-center gap-3 hover:text-[#C56545]"
                  href={`mailto:${siteConfig.email}`}
                >
                  <Mail aria-hidden="true" className="h-5 w-5 text-[#C56545]" />
                  {siteConfig.email}
                </a>
                <p className="flex items-center gap-3">
                  <MapPin aria-hidden="true" className="h-5 w-5 text-[#C56545]" />
                  Visakhapatnam | Kakinada | Bengaluru
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-[#DED7CF] bg-[#F5F1EA] p-6">
              <h2 className="text-2xl font-semibold text-[#202238]">
                Location pages
              </h2>
              <div className="mt-5 grid gap-3">
                {locations.map((location) => (
                  <a
                    className="rounded-[4px] border border-[#DED7CF] bg-[#FCFBF8] p-4 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
                    href={`/locations/${location.slug}`}
                    key={location.slug}
                  >
                    {location.name}, {location.region}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div id="quote">
            <LeadForm intent="quote" sourcePath="/contact" title="Request a quote" />
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1EA] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQs" title="Common enquiry questions" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5"
                key={faq.question}
              >
                <h2 className="text-lg font-semibold text-[#202238]">
                  {faq.question}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#625f5a]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
