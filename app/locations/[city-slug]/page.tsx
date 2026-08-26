import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { siteConfig } from "@/lib/constants";
import { getLocations, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { localBusinessJsonLd } from "@/lib/structured-data";
import { whatsappUrl } from "@/lib/whatsapp";

export const revalidate = 3600;

type LocationPageProps = {
  params: Promise<{ "city-slug": string }>;
};

export async function generateStaticParams() {
  const locations = await getLocations();

  return locations.map((location) => ({
    "city-slug": location.slug,
  }));
}

export async function generateMetadata({ params }: LocationPageProps) {
  const { "city-slug": slug } = await params;
  const locations = await getLocations();
  const location = locations.find((item) => item.slug === slug);

  if (!location) {
    return {};
  }

  return pageMetadata({
    title: location.seoTitle,
    description: location.seoDescription,
    path: `/locations/${location.slug}`,
    image: "/legacy/image%20(1)-D1OB4ju4.jpeg",
  });
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { "city-slug": slug } = await params;
  const [locations, projects] = await Promise.all([getLocations(), getProjects()]);
  const location = locations.find((item) => item.slug === slug);

  if (!location) {
    notFound();
  }

  const relatedProjects = projects.filter((project) =>
    location.relatedProjectSlugs.includes(project.slug),
  );

  return (
    <>
      <JsonLd data={localBusinessJsonLd(location)} />
      <PageHero
        breadcrumbs={[
          { name: "Locations", href: "/locations" },
          { name: location.name, href: `/locations/${location.slug}` },
        ]}
        eyebrow={location.region}
        image="/legacy/image%20(1)-D1OB4ju4.jpeg"
        title={`Office furniture in ${location.name}`}
      >
        <p>{location.intro}</p>
      </PageHero>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-5">
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6">
              <h2 className="text-2xl font-semibold text-[#202238]">
                Products and services available
              </h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#625f5a]">
                {location.services.map((service) => (
                  <li className="flex gap-3" key={service}>
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#C56545]"
                    />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6">
              <h2 className="text-2xl font-semibold text-[#202238]">
                Local information
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b746e]">
                    Address
                  </dt>
                  <dd className="mt-1 text-[#625f5a]">
                    {location.address ||
                      "Contact Destino for the current visiting address before planning a visit."}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b746e]">
                    Business hours
                  </dt>
                  <dd className="mt-1 text-[#625f5a]">
                    {location.businessHours ||
                      "Contact Destino to confirm the current visit or call-back window."}
                  </dd>
                </div>
              </dl>
              {location.mapEmbedUrl ? (
                <iframe
                  className="mt-5 aspect-video w-full rounded-lg border border-[#DED7CF]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={location.mapEmbedUrl}
                  title={`${location.name} map`}
                />
              ) : (
                <div className="mt-5 flex min-h-40 items-center justify-center rounded-lg border border-dashed border-[#DED7CF] bg-[#F5F1EA] p-5 text-center text-sm leading-6 text-[#625f5a]">
                  Contact Destino for verified directions before visiting this
                  location.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6">
              <h2 className="text-2xl font-semibold text-[#202238]">
                Contact Destino for {location.name}
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <a
                  className="rounded-[4px] border border-[#DED7CF] p-4 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
                  href={`tel:${siteConfig.phoneHref}`}
                >
                  <Phone
                    aria-hidden="true"
                    className="mb-3 h-5 w-5 text-[#C56545]"
                  />
                  {siteConfig.phoneDisplay}
                </a>
                <a
                  className="rounded-[4px] border border-[#DED7CF] p-4 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
                  href={whatsappUrl(
                    `Hello Destino Furniture Studio, I need furniture assistance for ${location.name}.`,
                  )}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle
                    aria-hidden="true"
                    className="mb-3 h-5 w-5 text-[#C56545]"
                  />
                  WhatsApp
                </a>
                <a
                  className="rounded-[4px] border border-[#DED7CF] p-4 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
                  href={`mailto:${siteConfig.email}`}
                >
                  <Mail
                    aria-hidden="true"
                    className="mb-3 h-5 w-5 text-[#C56545]"
                  />
                  Email
                </a>
              </div>
            </div>
            <LeadForm
              intent="location"
              sourcePath={`/locations/${location.slug}`}
              title={`${location.name} enquiry`}
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1EA] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
                Nearby project records
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#202238]">
                Related work for {location.name}
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] hover:text-[#202238]"
              href="/projects"
            >
              View all projects <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          {relatedProjects.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6 text-sm text-[#625f5a]">
              Contact Destino for relevant project references in this city.
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#FCFBF8] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6">
            <MapPin aria-hidden="true" className="h-5 w-5 text-[#C56545]" />
            <p className="mt-3 text-sm leading-6 text-[#625f5a]">
              Keep NAP details consistent across this page and the Google
              Business Profile once addresses are confirmed.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
