import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, MapPin, MessageCircle } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ImageGallery } from "@/components/image-gallery";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { ProjectEnquiryModal } from "@/components/project-enquiry-modal";
import { RichText } from "@/components/rich-text";
import { getBrands, getCategories, getProducts, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { projectJsonLd } from "@/lib/structured-data";
import { projectWhatsappMessage, whatsappUrl } from "@/lib/whatsapp";

export const revalidate = 3600;

type ProjectPageProps = {
  params: Promise<{ "project-slug": string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    "project-slug": project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { "project-slug": slug } = await params;
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {};
  }

  return pageMetadata({
    title: project.seoTitle,
    description: project.seoDescription,
    path: `/projects/${project.slug}`,
    image: project.coverImage || "/images/pages/projects/fallback-office-lounge.jpeg",
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { "project-slug": slug } = await params;
  const [projects, products, categories, brands] = await Promise.all([
    getProjects(),
    getProducts(),
    getCategories(),
    getBrands(),
  ]);
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const relatedProducts = products.filter((product) =>
    project.relatedProductSlugs.includes(product.slug),
  );
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const brandMap = new Map(brands.map((brand) => [brand.slug, brand]));

  return (
    <>
      <JsonLd data={projectJsonLd(project)} />
      <section className="relative overflow-hidden bg-[#FFF9F5] py-10 sm:py-12 lg:py-16">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F5E9DC] to-transparent" />
        <div className="absolute right-0 top-16 h-64 w-64 rounded-full bg-[#026670]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { name: "Projects", href: "/projects" },
                { name: project.title, href: `/projects/${project.slug}` },
              ]}
            />
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
            <div>
              <Link
                className="inline-flex items-center gap-2 text-base font-extrabold uppercase tracking-[0.16em] text-[#C56545] transition hover:text-[#1E3A8A]"
                href="/projects"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Projects
              </Link>
              <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.42em] text-[#B9854F]">
                Project showcase
              </p>
              <h1 className="mt-4 [font-family:var(--font-collection-heading)] text-3xl font-extrabold uppercase leading-tight tracking-[0.04em] text-[#026670] sm:text-4xl lg:text-5xl">
                {project.title}
              </h1>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E6DDD1] bg-white px-4 py-2 text-base font-bold uppercase tracking-[0.12em] text-[#1E3A8A] shadow-[0_10px_30px_rgba(32,34,56,0.06)]">
                  <Building2 aria-hidden="true" className="h-4 w-4 text-[#C56545]" />
                  {project.sector}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E6DDD1] bg-white px-4 py-2 text-base font-bold text-[#1E3A8A] shadow-[0_10px_30px_rgba(32,34,56,0.06)]">
                  <MapPin aria-hidden="true" className="h-4 w-4 text-[#C56545]" />
                  {project.location}
                </span>
              </div>
              <RichText
                className="mt-7 max-w-2xl space-y-4"
                paragraphClassName="text-lg font-medium leading-8 text-[#1E3A8A]"
                text={project.description}
              />
              <a
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#202238] px-7 text-base font-bold uppercase tracking-[0.12em] text-white shadow-[0_16px_34px_rgba(32,34,56,0.16)] transition hover:-translate-y-0.5 hover:bg-[#C56545]"
                href={whatsappUrl(
                  projectWhatsappMessage(project.title, `/projects/${project.slug}`),
                )}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Enquire about this project
              </a>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-[#026670]/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-[0_30px_90px_rgba(32,34,56,0.16)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-[#F4EFE7]">
                  {project.coverImage ? (
                    <Image
                      alt={project.title}
                      className="object-cover"
                      fill
                      priority
                      sizes="(min-width: 1024px) 620px, 100vw"
                      src={project.coverImage}
                    />
                  ) : project.coverVideo ? (
                    <video
                      aria-label={`${project.title} project video`}
                      className="h-full w-full object-cover"
                      controls
                      muted
                      playsInline
                      preload="metadata"
                      src={project.coverVideo}
                    />
                  ) : (
                    <Image
                      alt={project.title}
                      className="object-cover"
                      fill
                      priority
                      sizes="(min-width: 1024px) 620px, 100vw"
                      src="/images/pages/projects/fallback-office-lounge.jpeg"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <aside className="space-y-6">
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5">
              <h2 className="text-lg font-semibold text-[#202238]">
                Project details
              </h2>
              <dl className="mt-4 space-y-4 text-base">
                {[
                  ["Client", project.clientName],
                  ["Sector", project.sector],
                  ["Location", project.location],
                  ["Furniture categories", project.categories.map((item) => categoryMap.get(item)?.name || item).join(", ")],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7b746e]">
                      {label}
                    </dt>
                    <dd className="mt-1 font-medium text-[#1E3A8A]">{value}</dd>
                  </div>
                ))}
              </dl>
              <a
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-4 text-base font-semibold text-white hover:bg-[#C56545]"
                href={whatsappUrl(
                  projectWhatsappMessage(project.title, `/projects/${project.slug}`),
                )}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Ask about similar work
              </a>
            </div>
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5">
              <h2 className="text-lg font-semibold text-[#202238]">
                Scope of work
              </h2>
              <ul className="mt-4 space-y-3 text-base font-medium leading-7 text-[#1E3A8A]">
                {project.scope.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#C56545]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="space-y-8">
            {project.coverVideo && project.coverImage ? (
              <div className="overflow-hidden rounded-lg border border-[#DED7CF] bg-black">
                <video
                  className="aspect-video w-full"
                  controls
                  preload="metadata"
                  src={project.coverVideo}
                />
              </div>
            ) : null}
            <ImageGallery images={project.gallery} title={project.title} />
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="bg-[#F5F1EA] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
                  Related products
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#202238]">
                  Furniture ranges connected to this project
                </h2>
              </div>
              <Link
                className="inline-flex items-center gap-2 text-base font-semibold text-[#C56545] hover:text-[#202238]"
                href="/products"
              >
                View catalogue <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((product) => (
                <ProductCard
                  brand={
                    product.brandSlug ? brandMap.get(product.brandSlug) : undefined
                  }
                  category={categoryMap.get(product.categorySlug)}
                  key={product.slug}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-20 md:py-32 border-t border-[#E6DDD1]">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C56545]">
            Project enquiry
          </span>
          <h2 className="mt-4 text-4xl font-bold text-[#202238] sm:text-5xl">
            Planning a similar requirement?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#625f5a]">
            Share the city, room type, quantities and any reference products
            so Destino can respond with a useful next step.
          </p>
          <ProjectEnquiryModal projectSlug={project.slug} projectTitle={project.title} />
        </div>
      </section>
    </>
  );
}
