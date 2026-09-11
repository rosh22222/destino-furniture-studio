import "server-only";

import {
  brands as seedBrands,
  categories as seedCategories,
  clients as seedClients,
  faqs as seedFaqs,
  products as seedProducts,
  projects as seedProjects,
} from "@/lib/data";
import { createPublicSupabaseClient } from "@/lib/supabase";
import type {
  Brand,
  Category,
  Client,
  Faq,
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

function clientFromRow(row: ContentRow, fallback?: Client): Client {
  const content = row.content || {};

  return {
    ...fallback,
    ...(content as Partial<Client>),
    slug: row.slug,
    name: row.title || fallback?.name || row.slug,
    logo: row.image_url || String(content.logo || fallback?.logo || ""),
    sector: String(content.sector || fallback?.sector || "Client"),
    displayOrder: row.display_order ?? fallback?.displayOrder ?? 100,
  };
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

  const mergedProducts = new Map(
    byOrder(seedProducts)
      .filter((product) => product.status === "published")
      .map((product) => [product.slug, product]),
  );

  rows.forEach((row) => {
    const content = row.content || {};
    const fallback = mergedProducts.get(row.slug);
    const image = row.image_url || String(content.image || fallback?.image || "");
    const gallery = Array.isArray(content.gallery)
      ? (content.gallery as string[])
      : fallback?.gallery || [];

    mergedProducts.set(row.slug, {
      ...fallback,
      ...(content as Partial<Product>),
      slug: row.slug,
      name: row.title,
      image,
      gallery: gallery.length ? gallery : image ? [image] : [],
      categorySlug: String(content.categorySlug || fallback?.categorySlug || ""),
      furnitureType: String(content.furnitureType || fallback?.furnitureType || "Furniture"),
      relatedSlugs: Array.isArray(content.relatedSlugs)
        ? (content.relatedSlugs as string[])
        : fallback?.relatedSlugs || [],
      displayOrder: row.display_order ?? 100,
      status: "published",
      seoTitle: String(content.seoTitle || fallback?.seoTitle || row.title),
      seoDescription: String(
        content.seoDescription || fallback?.seoDescription || content.shortDescription || "",
      ),
      shortDescription: String(content.shortDescription || fallback?.shortDescription || ""),
      updatedAt: rowDate(row),
    });
  });

  return byOrder([...mergedProducts.values()]);
}

export async function getProjects(): Promise<Project[]> {
  const rows = await fetchContentRows("projects");

  if (!rows) {
    return byOrder(seedProjects);
  }

  const mergedProjects = new Map(seedProjects.map((project) => [project.slug, project]));

  rows.forEach((row) => {
    const content = row.content || {};
    const fallback = mergedProjects.get(row.slug);
    const coverImage = row.image_url || String(content.coverImage || fallback?.coverImage || "");
    const gallery = Array.isArray(content.gallery)
      ? (content.gallery as string[])
      : fallback?.gallery || [];

    mergedProjects.set(row.slug, {
      ...fallback,
      ...(content as Partial<Project>),
      slug: row.slug,
      title: row.title,
      clientName: String(content.clientName || fallback?.clientName || row.title),
      sector: String(content.sector || fallback?.sector || "Commercial"),
      location: String(content.location || fallback?.location || ""),
      coverImage,
      gallery: gallery.length ? gallery : coverImage ? [coverImage] : [],
      description: String(content.description || fallback?.description || ""),
      scope: Array.isArray(content.scope)
        ? (content.scope as string[])
        : fallback?.scope || [],
      categories: Array.isArray(content.categories)
        ? (content.categories as string[])
        : fallback?.categories || [],
      relatedProductSlugs: Array.isArray(content.relatedProductSlugs)
        ? (content.relatedProductSlugs as string[])
        : fallback?.relatedProductSlugs || [],
      displayOrder: row.display_order ?? 100,
      seoTitle: String(content.seoTitle || fallback?.seoTitle || row.title),
      seoDescription: String(
        content.seoDescription || fallback?.seoDescription || content.description || "",
      ),
      updatedAt: rowDate(row),
    });
  });

  return byOrder([...mergedProjects.values()]);
}

export async function getClients(): Promise<Client[]> {
  const rows = await fetchContentRows("clients");

  if (!rows) {
    return byOrder(seedClients);
  }

  const mergedClients = new Map(seedClients.map((client) => [client.slug, client]));

  rows.forEach((row) => {
    mergedClients.set(row.slug, clientFromRow(row, mergedClients.get(row.slug)));
  });

  return byOrder([...mergedClients.values()]);
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
