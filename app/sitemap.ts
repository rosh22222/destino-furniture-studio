import type { MetadataRoute } from "next";

import {
  getCategories,
  getInsights,
  getLocations,
  getProducts,
  getProjects,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, projects, locations, insights] = await Promise.all([
    getCategories(),
    getProducts(),
    getProjects(),
    getLocations(),
    getInsights(),
  ]);

  const staticRoutes = [
    "/",
    "/about",
    "/products",
    "/solutions",
    "/projects",
    "/clients",
    "/locations",
    "/insights",
    "/contact",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date("2026-08-26"),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...categories.map((category) => ({
      url: absoluteUrl(`/products/${category.slug}`),
      lastModified: new Date("2026-08-26"),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [absoluteUrl(category.image)],
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/product/${product.slug}`),
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [absoluteUrl(product.image)],
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: project.coverImage ? [absoluteUrl(project.coverImage)] : [],
    })),
    ...locations.map((location) => ({
      url: absoluteUrl(`/locations/${location.slug}`),
      lastModified: new Date(location.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...insights.map((article) => ({
      url: absoluteUrl(`/insights/${article.slug}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
      images: [absoluteUrl(article.image)],
    })),
  ];
}

