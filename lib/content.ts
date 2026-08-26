import "server-only";

import {
  brands as seedBrands,
  categories as seedCategories,
  clients as seedClients,
  faqs as seedFaqs,
  insights as seedInsights,
  locations as seedLocations,
  products as seedProducts,
  projects as seedProjects,
} from "@/lib/data";
import { createPublicSupabaseClient } from "@/lib/supabase";
import type {
  Brand,
  Category,
  Client,
  Faq,
  Insight,
  Location,
  Product,
  Project,
} from "@/lib/types";

type ContentRow = {
  title: string;
  slug: string;
  status: string;
  display_order: number | null;
  image_url: string | null;
  image_alt: string | null;
  content: Record<string, unknown> | null;
  updated_at: string | null;
};

const cacheSeconds = 3600;

async function fetchContentRows(table: string) {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(table)
    .select("title,slug,status,display_order,image_url,image_alt,content,updated_at")
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .limit(500);

  if (error || !data?.length) {
    return null;
  }

  return data as ContentRow[];
}

function byOrder<T extends { displayOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
}

function rowDate(row: ContentRow) {
  return row.updated_at?.slice(0, 10) || "2026-08-26";
}

export async function getCategories(): Promise<Category[]> {
  const rows = await fetchContentRows("product_categories");

  if (!rows) {
    return byOrder(seedCategories);
  }

  return rows.map((row) => ({
    ...(row.content as Partial<Category>),
    slug: row.slug,
    name: row.title,
    image: row.image_url || String(row.content?.image || ""),
    displayOrder: row.display_order ?? 100,
    summary: String(row.content?.summary || ""),
    description: String(row.content?.description || row.content?.summary || ""),
    keywords: Array.isArray(row.content?.keywords)
      ? (row.content?.keywords as string[])
      : [],
  }));
}

export async function getBrands(): Promise<Brand[]> {
  const rows = await fetchContentRows("brands");

  if (!rows) {
    return byOrder(seedBrands);
  }

  return rows.map((row) => ({
    ...(row.content as Partial<Brand>),
    slug: row.slug,
    name: row.title,
    logo: row.image_url || String(row.content?.logo || ""),
    kind: (row.content?.kind as Brand["kind"]) || "channel-partner",
    displayOrder: row.display_order ?? 100,
  }));
}

export async function getProducts(): Promise<Product[]> {
  const rows = await fetchContentRows("products");

  if (!rows) {
    return byOrder(seedProducts).filter((product) => product.status === "published");
  }

  return rows.map((row) => {
    const content = row.content || {};

    return {
      ...(content as Partial<Product>),
      slug: row.slug,
      name: row.title,
      image: row.image_url || String(content.image || ""),
      gallery: Array.isArray(content.gallery) ? (content.gallery as string[]) : [],
      categorySlug: String(content.categorySlug || ""),
      furnitureType: String(content.furnitureType || "Furniture"),
      relatedSlugs: Array.isArray(content.relatedSlugs)
        ? (content.relatedSlugs as string[])
        : [],
      displayOrder: row.display_order ?? 100,
      status: "published",
      seoTitle: String(content.seoTitle || row.title),
      seoDescription: String(content.seoDescription || content.shortDescription || ""),
      shortDescription: String(content.shortDescription || ""),
      updatedAt: rowDate(row),
    };
  });
}

export async function getProjects(): Promise<Project[]> {
  const rows = await fetchContentRows("projects");

  if (!rows) {
    return byOrder(seedProjects);
  }

  return rows.map((row) => {
    const content = row.content || {};

    return {
      ...(content as Partial<Project>),
      slug: row.slug,
      title: row.title,
      clientName: String(content.clientName || row.title),
      sector: String(content.sector || "Commercial"),
      location: String(content.location || ""),
      coverImage: row.image_url || String(content.coverImage || ""),
      gallery: Array.isArray(content.gallery) ? (content.gallery as string[]) : [],
      description: String(content.description || ""),
      scope: Array.isArray(content.scope) ? (content.scope as string[]) : [],
      categories: Array.isArray(content.categories) ? (content.categories as string[]) : [],
      relatedProductSlugs: Array.isArray(content.relatedProductSlugs)
        ? (content.relatedProductSlugs as string[])
        : [],
      displayOrder: row.display_order ?? 100,
      seoTitle: String(content.seoTitle || row.title),
      seoDescription: String(content.seoDescription || content.description || ""),
      updatedAt: rowDate(row),
    };
  });
}

export async function getClients(): Promise<Client[]> {
  const rows = await fetchContentRows("clients");

  if (!rows) {
    return byOrder(seedClients);
  }

  return rows.map((row) => ({
    ...(row.content as Partial<Client>),
    slug: row.slug,
    name: row.title,
    logo: row.image_url || String(row.content?.logo || ""),
    sector: String(row.content?.sector || "Client"),
    displayOrder: row.display_order ?? 100,
  }));
}

export async function getLocations(): Promise<Location[]> {
  const rows = await fetchContentRows("locations");

  if (!rows) {
    return seedLocations;
  }

  return rows.map((row) => {
    const content = row.content || {};

    return {
      ...(content as Partial<Location>),
      slug: row.slug,
      name: row.title,
      region: String(content.region || ""),
      intro: String(content.intro || ""),
      services: Array.isArray(content.services) ? (content.services as string[]) : [],
      serviceAreas: Array.isArray(content.serviceAreas)
        ? (content.serviceAreas as string[])
        : [],
      relatedProjectSlugs: Array.isArray(content.relatedProjectSlugs)
        ? (content.relatedProjectSlugs as string[])
        : [],
      seoTitle: String(content.seoTitle || row.title),
      seoDescription: String(content.seoDescription || content.intro || ""),
      updatedAt: rowDate(row),
    };
  });
}

export async function getInsights(): Promise<Insight[]> {
  const rows = await fetchContentRows("insights");

  if (!rows) {
    return [...seedInsights].sort(
      (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    );
  }

  return rows.map((row) => {
    const content = row.content || {};

    return {
      ...(content as Partial<Insight>),
      slug: row.slug,
      title: row.title,
      image: row.image_url || String(content.image || ""),
      category: String(content.category || "Insights"),
      excerpt: String(content.excerpt || ""),
      body: Array.isArray(content.body) ? (content.body as string[]) : [],
      author: String(content.author || "Destino Furniture Studio"),
      publishedAt: String(content.publishedAt || rowDate(row)),
      updatedAt: rowDate(row),
      seoTitle: String(content.seoTitle || row.title),
      seoDescription: String(content.seoDescription || content.excerpt || ""),
    };
  });
}

export async function getFaqs(): Promise<Faq[]> {
  const rows = await fetchContentRows("faqs");

  if (!rows) {
    return seedFaqs;
  }

  return rows.map((row) => ({
    question: row.title,
    answer: String(row.content?.answer || ""),
  }));
}

export const contentRevalidateSeconds = cacheSeconds;
