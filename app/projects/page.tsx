import Image from "next/image";
import { JsonLd } from "@/components/json-ld";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/structured-data";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Explore completed office, institutional, restaurant, healthcare and commercial furniture project records from Destino Furniture Studio.",
  path: "/projects",
  image: "/images/pages/projects/project-hero-banner.png",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-[#FFF9F5] pb-24">
      <JsonLd
        data={itemListJsonLd(
          "Destino Furniture Studio projects",
          projects.map((project) => ({
            name: project.title,
            href: `/projects/${project.slug}`,
          })),
        )}
      />
      
      <section className="text-center">
        <div className="relative flex h-[300px] items-center justify-center overflow-hidden bg-[#F4EFE7] sm:h-[360px] lg:h-[411px]">
          <Image
            alt="Destino furniture project portfolio banner"
            className="object-cover object-center"
            fill
            priority
            src="/images/pages/projects/project-hero-banner.png"
          />
          <div className="absolute inset-0 bg-white/62" />
          <div className="relative max-w-3xl px-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.45em] text-[#B9854F]">
              Our portfolio
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-none tracking-normal text-[#164E4A] sm:text-6xl lg:text-7xl">
              PROJECTS
            </h1>
            <p className="mt-2 text-4xl font-light italic leading-tight text-[#77746F] sm:text-5xl lg:text-6xl">
              & Spaces.
            </p>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#4F5E5A]">
              Explore completed office, institutional, healthcare and commercial
              furniture projects delivered with refined planning.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              priority={index < 3}
              project={project}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
