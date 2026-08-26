import { siteConfig } from "@/lib/constants";
import type { Category, Insight, Location, Product, Project } from "@/lib/types";
import { absoluteUrl } from "@/lib/seo";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.baseUrl,
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.parentCompany,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: siteConfig.phoneDisplay,
        email: siteConfig.email,
        areaServed: "IN",
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.baseUrl}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessJsonLd(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: `${siteConfig.name} - ${location.name}`,
    url: absoluteUrl(`/locations/${location.slug}`),
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    areaServed: location.serviceAreas,
    address: location.address
      ? {
          "@type": "PostalAddress",
          streetAddress: location.address,
          addressLocality: location.name,
          addressRegion: location.region,
          addressCountry: "IN",
        }
      : undefined,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function productJsonLd(product: Product, category?: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.gallery.length
      ? product.gallery.map((image) => absoluteUrl(image))
      : [absoluteUrl(product.image)],
    description: product.shortDescription,
    sku: product.sku,
    category: category?.name,
    brand: product.brandSlug
      ? {
          "@type": "Brand",
          name: product.brandSlug,
        }
      : undefined,
  };
}

export function itemListJsonLd(name: string, items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.href),
    })),
  };
}

export function articleJsonLd(article: Insight) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl(article.image),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.coverImage ? absoluteUrl(project.coverImage) : undefined,
    about: project.categories,
    locationCreated: project.location,
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
