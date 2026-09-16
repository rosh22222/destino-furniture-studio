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
import { readContentRows } from "@/lib/content-rows";
import { mergeCatalogue, productFromRow, projectFromRow, type ContentRow } from "@/lib/catalogue-records";
import type {
  Brand,
  Category,
  Client,
  Faq,
  Product,
  Project,
} from "@/lib/types";

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
  const { rows, overrides } = await fetchCatalogue("products");
  return mergeCatalogue(seedProducts.filter((product) => product.status === "published"), rows, overrides, productFromRow);
}

export async function getProjects(): Promise<Project[]> {
  const { rows, overrides } = await fetchCatalogue("projects");
  return mergeCatalogue(seedProjects, rows, overrides, projectFromRow);
}

async function fetchCatalogue(table: "products" | "projects") {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return { rows: [], overrides: [] };
  const [rows, identities] = await Promise.all([
    readContentRows(supabase, table, true),
    supabase.rpc("catalogue_overrides", { resource: table }),
  ]);
  if (identities.error) throw new Error("Could not load the catalogue. Please try again.", { cause: identities.error });
  return { rows: rows as ContentRow[], overrides: (identities.data as { slug: string }[]).map((row) => row.slug) };
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
