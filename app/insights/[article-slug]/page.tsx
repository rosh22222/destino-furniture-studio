import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { getInsights } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { articleJsonLd } from "@/lib/structured-data";

export const revalidate = 3600;

type ArticlePageProps = {
  params: Promise<{ "article-slug": string }>;
};

export async function generateStaticParams() {
  const insights = await getInsights();

  return insights.map((article) => ({
    "article-slug": article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { "article-slug": slug } = await params;
  const insights = await getInsights();
  const article = insights.find((item) => item.slug === slug);

  if (!article) {
    return {};
  }

  return pageMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/insights/${article.slug}`,
    image: article.image,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { "article-slug": slug } = await params;
  const insights = await getInsights();
  const article = insights.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <article className="bg-[#FCFBF8]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: "Insights", href: "/insights" },
              { name: article.title, href: `/insights/${article.slug}` },
            ]}
          />
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
            {article.category} | {formatDate(article.publishedAt)}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#202238] md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#625f5a]">
            {article.excerpt}
          </p>
        </div>
        <div className="relative mx-auto aspect-[16/9] max-w-6xl overflow-hidden rounded-lg border border-[#DED7CF] bg-[#F5F1EA]">
          <Image
            alt={article.title}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 80vw, 100vw"
            src={article.image}
          />
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-6 text-lg leading-8 text-[#3f3d41]">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] hover:text-[#202238]"
            href="/insights"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to insights
          </Link>
        </div>
      </article>
    </>
  );
}

