import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { getInsights } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { itemListJsonLd } from "@/lib/structured-data";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Furniture Insights",
  description:
    "Furniture buying guides, ergonomics notes, office planning checklists and workspace design insights from Destino Furniture Studio.",
  path: "/insights",
  image: "/legacy/image%20(1)-D1OB4ju4.jpeg",
});

export default async function InsightsPage() {
  const insights = await getInsights();
  const categories = [...new Set(insights.map((article) => article.category))];

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          "Destino Furniture Studio insights",
          insights.map((article) => ({
            name: article.title,
            href: `/insights/${article.slug}`,
          })),
        )}
      />
      <PageHero
        breadcrumbs={[{ name: "Insights", href: "/insights" }]}
        eyebrow="Insights"
        image="/legacy/image%20(1)-D1OB4ju4.jpeg"
        title="Useful notes for furniture buyers"
      >
        <p>
          Practical guidance for office planning, ergonomics, workspace design
          and quotation preparation.
        </p>
      </PageHero>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                className="rounded-[4px] border border-[#DED7CF] bg-[#FCFBF8] px-4 py-2 text-sm font-semibold text-[#202238]"
                key={category}
              >
                {category}
              </span>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((article, index) => (
              <article
                className="overflow-hidden rounded-lg border border-[#DED7CF] bg-[#FCFBF8]"
                key={article.slug}
              >
                <Link className="block" href={`/insights/${article.slug}`}>
                  <div className="relative aspect-[4/3] bg-[#F5F1EA]">
                    <Image
                      alt={article.title}
                      className="object-cover"
                      fill
                      priority={index < 3}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                      src={article.image}
                    />
                  </div>
                </Link>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
                    {article.category} | {formatDate(article.publishedAt)}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold leading-snug text-[#202238]">
                    <Link
                      className="hover:text-[#C56545]"
                      href={`/insights/${article.slug}`}
                    >
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#625f5a]">
                    {article.excerpt}
                  </p>
                  <Link
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] hover:text-[#202238]"
                    href={`/insights/${article.slug}`}
                  >
                    Read article
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

