import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";

import { ImageGallery } from "@/components/image-gallery";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { ProjectEnquiryModal } from "@/components/project-enquiry-modal";
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
      <PageHero
        breadcrumbs={[
          { name: "Projects", href: "/projects" },
          { name: project.title, href: `/projects/${project.slug}` },
        ]}
        image={project.coverImage || "/images/pages/projects/fallback-office-lounge.jpeg"}
        title={project.title}
      >
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-[#DED7CF]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C56545]"></span>
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-white">{project.sector}</span>
          </div>
          <div className="hidden sm:block h-4 w-[1px] bg-white/30"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-wide">{project.location}</span>
          </div>
        </div>
        <div className="mt-8 max-w-2xl text-[17px] leading-relaxed text-white/90">
          {project.description}
        </div>
      </PageHero>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <aside className="space-y-6">
            <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5">
              <h2 className="text-lg font-semibold text-[#202238]">
                Project details
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                {[
                  ["Client", project.clientName],
                  ["Sector", project.sector],
                  ["Location", project.location],
                  ["Furniture categories", project.categories.map((item) => categoryMap.get(item)?.name || item).join(", ")],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b746e]">
                      {label}
                    </dt>
                    <dd className="mt-1 text-[#29282D]">{value}</dd>
                  </div>
                ))}
              </dl>
              <a
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-4 text-sm font-semibold text-white hover:bg-[#C56545]"
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
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#625f5a]">
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
            {project.coverVideo ? (
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
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] hover:text-[#202238]"
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
