import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
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
  image: "/images/pages/projects/hero-office-lounge.jpeg",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          "Destino Furniture Studio projects",
          projects.map((project) => ({
            name: project.title,
            href: `/projects/${project.slug}`,
          })),
        )}
      />
      <PageHero
        breadcrumbs={[{ name: "Projects", href: "/projects" }]}
        eyebrow="Projects"
        image="/images/pages/projects/hero-office-lounge.jpeg"
        title="Completed project records, rebuilt as case studies"
      >
        <p>
          Project names and real photographs from the existing portfolio are
          retained, with unverified dates and claims left out until confirmed.
        </p>
      </PageHero>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              priority={index < 3}
              project={project}
            />
          ))}
        </div>
      </section>
    </>
  );
}

