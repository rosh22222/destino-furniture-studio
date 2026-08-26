import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, Home, Utensils } from "lucide-react";

import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { getCategories } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Furniture Solutions",
  description:
    "Office interiors, office furniture, institutional furniture, restaurant furniture and custom furniture solutions from Destino Furniture Studio.",
  path: "/solutions",
  image: "/legacy/image%20(1)-D1OB4ju4.jpeg",
});

export default async function SolutionsPage() {
  const categories = await getCategories();
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const solutions = [
    {
      icon: Building2,
      title: "Office interiors and workstations",
      description:
        "Furniture-led planning for cabins, team workstations, meeting rooms, reception spaces and storage.",
      links: ["office-interiors", "workstation-tables-and-chairs", "office-tables"],
    },
    {
      icon: GraduationCap,
      title: "Institutional furniture",
      description:
        "Furniture support for education, government, training and administrative environments.",
      links: ["institutional-furniture", "office-chairs", "office-tables"],
    },
    {
      icon: Utensils,
      title: "Restaurant and cafeteria furniture",
      description:
        "Tables, seating and commercial furniture guidance for hospitality and shared dining spaces.",
      links: ["restaurant-furniture", "cafeteria-furniture"],
    },
    {
      icon: Home,
      title: "Custom and domestic furniture",
      description:
        "Measurement-led custom furniture and selected domestic furniture enquiries.",
      links: ["customized-furniture", "domestic-furniture"],
    },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Solutions", href: "/solutions" }]}
        eyebrow="Solutions"
        image="/legacy/image%20(1)-D1OB4ju4.jpeg"
        title="Furniture solutions shaped around the room, not a cart"
      >
        <p>
          Select a use case, save relevant products and request a quotation with
          the context Destino needs to respond properly.
        </p>
      </PageHero>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {solutions.map((solution) => (
            <article
              className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6"
              key={solution.title}
            >
              <solution.icon
                aria-hidden="true"
                className="h-7 w-7 text-[#C56545]"
              />
              <h2 className="mt-4 text-2xl font-semibold text-[#202238]">
                {solution.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#625f5a]">
                {solution.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {solution.links.map((slug) => {
                  const category = categoryMap.get(slug);
                  if (!category) {
                    return null;
                  }

                  return (
                    <Link
                      className="inline-flex h-10 items-center justify-center rounded-[4px] border border-[#DED7CF] px-3 text-sm font-semibold text-[#202238] hover:border-[#C56545] hover:text-[#C56545]"
                      href={`/products/${category.slug}`}
                      key={category.slug}
                    >
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#202238] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1fr] lg:px-8">
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
              Start a brief
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Tell Destino about your space and furniture mix.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#DED7CF]">
              Include city, room type, quantities, timeline and whether you need
              ready products or custom furniture.
            </p>
            <Link
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F5F1EA] hover:text-white"
              href="/projects"
            >
              Browse project references
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <LeadForm intent="general" sourcePath="/solutions" title="Discuss a solution" />
        </div>
      </section>
    </>
  );
}

