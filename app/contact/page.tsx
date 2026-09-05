import Image from "next/image";
import type { SVGProps } from "react";
import {
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { FaqAccordion } from "@/components/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { siteConfig } from "@/lib/constants";
import { getFaqs } from "@/lib/content";
import { locations } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structured-data";
import { whatsappUrl } from "@/lib/whatsapp";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Destino Furniture Studio for office furniture, ergonomic chairs, custom furniture and commercial project quotations.",
  path: "/contact",
  image: "/images/pages/contact/contact-reach-us-hero.png",
});

const primaryAddress = [
  "3rd Ln, Tpc Area Office, Opp. Gayatri Xerox",
  "Lakshmi Srinivasam, Dwaraka Nagar",
  "Visakhapatnam, Andhra Pradesh 530016",
];

const kakinadaAddress =
  "Upstairs Mohmad khan & Sons Jewelers, Ganjam Vari St, Kakinada, Andhra Pradesh 533001, India";

function WhatsAppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 32 32" {...props}>
      <path
        d="M16 4.5c-6.36 0-11.5 4.91-11.5 10.98 0 2.07.61 4 1.66 5.65L4.8 27.5l6.48-1.5A12.07 12.07 0 0 0 16 26.47c6.36 0 11.5-4.91 11.5-10.98S22.36 4.5 16 4.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
      <path
        d="M11.98 11.09c.25-.56.52-.57.77-.57h.65c.2 0 .49.07.75.54.28.5.95 2.05 1.03 2.2.09.16.14.35.03.56-.11.22-.17.35-.34.54-.17.19-.36.43-.52.57-.17.17-.35.34-.15.66.19.32.86 1.36 1.84 2.21 1.26 1.09 2.3 1.43 2.64 1.59.35.16.55.14.75-.09.2-.23.87-.96 1.1-1.29.23-.32.46-.27.78-.16.32.11 2.01.91 2.35 1.07.35.16.58.24.66.37.09.13.09.78-.2 1.52-.29.75-1.65 1.44-2.28 1.49-.61.06-1.38.09-2.23-.13-.52-.13-1.18-.36-2.02-.72-3.56-1.48-5.88-4.9-6.06-5.13-.17-.23-1.45-1.85-1.45-3.53s.89-2.5 1.15-2.83Z"
        fill="currentColor"
      />
    </svg>
  );
}

function mapsQuery(place: string) {
  return encodeURIComponent(`Destino Furniture Studio ${place}`);
}

const contactDetails = [
  {
    title: "Our Showroom",
    text: primaryAddress.join(", "),
    href: `https://www.google.com/maps/search/?api=1&query=${mapsQuery("Visakhapatnam")}`,
    icon: MapPin,
    tone: "bg-[#EDF7F6] text-[#164E4A]",
  },
  {
    title: "Call Us",
    text: siteConfig.phoneDisplay,
    href: `tel:${siteConfig.phoneHref}`,
    icon: Phone,
    tone: "bg-[#EAF7F0] text-[#1B8754]",
  },
  {
    title: "WhatsApp",
    text: siteConfig.whatsappDisplay,
    href: whatsappUrl(
      "Hello Destino Furniture Studio, I would like to request a quotation.",
    ),
    icon: WhatsAppLogo,
    tone: "bg-[#E9FBF0] text-[#25D366]",
    external: true,
  },
  {
    title: "Email Us",
    text: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    icon: Mail,
    tone: "bg-[#FDEDEC] text-[#EA4335]",
  },
  {
    title: "Business Hours",
    text: "Mon - Sat: 10:00 AM - 8:00 PM",
    href: "#quote",
    icon: Clock,
    tone: "bg-[#F7F1EA] text-[#B9854F]",
  },
];

const locationCards = locations
  .filter((location) => location.slug !== "bengaluru")
  .map((location) => {
    const address =
      location.slug === "visakhapatnam"
        ? primaryAddress.join(", ")
        : location.slug === "kakinada"
          ? kakinadaAddress
          : `${location.name}, ${location.region}`;
    const query =
      location.slug === "kakinada"
        ? encodeURIComponent(kakinadaAddress)
        : mapsQuery(location.name);

    return {
      ...location,
      mapSrc: `https://www.google.com/maps?q=${query}&output=embed`,
      directionsUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
      address,
    };
  });

export default async function ContactPage() {
  const faqs = await getFaqs();

  return (
    <main className="min-h-screen bg-[#FBFAF7] pb-20 text-[#143F3D]">
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="pb-12 text-center">
        <div className="relative flex h-[300px] items-center justify-center overflow-hidden bg-[#F4EFE7] sm:h-[360px] lg:h-[411px]">
          <Image
            alt="Premium office furniture contact banner"
            className="object-cover object-center"
            fill
            priority
            src="/images/pages/contact/contact-reach-us-hero.png"
          />
          <div className="absolute inset-0 bg-white/62" />
          <div className="relative max-w-3xl px-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.45em] text-[#B9854F]">
              Get in touch
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-none tracking-normal text-[#164E4A] sm:text-6xl lg:text-7xl">
              CONTACT
            </h1>
            <p className="mt-2 text-4xl font-light italic leading-tight text-[#77746F] sm:text-5xl lg:text-6xl">
              & Reach Us.
            </p>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#4F5E5A]">
              Our team is here to help you find the right seating, workstation
              and office furniture solution for your workspace.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <div className="space-y-7">
          {contactDetails.map((item) => {
            const Icon = item.icon;

            return (
              <a
                className="group flex gap-5"
                href={item.href}
                key={item.title}
                rel={item.external ? "noreferrer" : undefined}
                target={item.external ? "_blank" : undefined}
              >
                <span
                  className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] transition group-hover:scale-105 ${item.tone}`}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-extrabold text-[#1E3A8A]">
                    {item.title}
                  </span>
                  <span className="mt-2 block break-words text-sm leading-7 text-[#1E3A8A]">
                    {item.text}
                  </span>
                </span>
              </a>
            );
          })}
        </div>

        <div id="quote" className="rounded-lg border border-[#E9E1D8] bg-white p-6 shadow-[0_24px_70px_rgba(32,34,56,0.08)] sm:p-8 lg:p-10">
          <LeadForm
            intent="quote"
            sourcePath="/contact"
            title="Send us your requirement"
          />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.36em] text-[#B9854F]">
            Our locations
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl [font-family:var(--font-collection-heading)] text-2xl font-extrabold uppercase leading-tight tracking-[0.04em] text-[#026670] sm:text-3xl md:text-4xl">
            Connect with Destino
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {locationCards.map((location) => (
            <article
              className="overflow-hidden rounded-lg border border-[#E9E1D8] bg-white shadow-[0_18px_50px_rgba(32,34,56,0.07)]"
              key={location.slug}
            >
              <div className="p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-[#EDF7F6] text-[#164E4A]">
                    <MapPin aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#164E4A]">
                      {location.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#B9854F]">
                      {location.region}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-[#6F6B65]">
                  {location.address}
                </p>
                <a
                  className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#164E4A] transition hover:text-[#B9854F]"
                  href={location.directionsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open Google Maps
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
              <div className="relative h-64 border-t border-[#E9E1D8] bg-[#F4EFE7]">
                <iframe
                  allowFullScreen={true}
                  className="absolute inset-0 h-full w-full"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={location.mapSrc}
                  style={{ border: 0 }}
                  title={`${location.name} Google Map`}
                  width="100%"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.36em] text-[#B9854F]">
              Support
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl [font-family:var(--font-collection-heading)] text-2xl font-extrabold uppercase leading-tight tracking-[0.04em] text-[#026670] sm:text-3xl md:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
    </main>
  );
}
