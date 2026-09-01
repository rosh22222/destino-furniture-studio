import type { MetadataRoute } from "next";

import {
  getCategories,
  getProducts,
  getProjects,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, projects] = await Promise.all([
    getCategories(),
    getProducts(),
    getProjects(),
  ]);

  const staticRoutes = [
    "/",
    "/about",
    "/products",
    "/projects",
    "/clients",
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
      images: product.image ? [absoluteUrl(product.image)] : [],
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: project.coverImage ? [absoluteUrl(project.coverImage)] : [],
    })),
  ];
}
