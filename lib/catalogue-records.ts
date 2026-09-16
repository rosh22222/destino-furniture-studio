import type { Product, Project } from "@/lib/types";

export type ContentRow = {
  title: string;
  slug: string;
  status: string;
  display_order: number | null;
  image_url: string | null;
  image_alt: string | null;
  content: Record<string, unknown> | null;
  updated_at: string | null;
};

export function sourceSlug(row: { slug?: string; content?: Record<string, unknown> | null }) {
  return typeof row.content?._seedSlug === "string" ? row.content._seedSlug : row.slug || "";
}

function strings(value: unknown, fallback: string[] = []) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : fallback;
}

export function productFromRow(row: ContentRow, fallback?: Product): Product {
  const content = row.content || {};
  const image = String(content.image ?? row.image_url ?? fallback?.image ?? "");
  const description = String(content.fullDescription ?? content.shortDescription ?? fallback?.fullDescription ?? fallback?.shortDescription ?? "");

  return {
    ...fallback,
    ...content,
    slug: row.slug,
    name: row.title,
    image: row.image_url ?? image,
    coverVideo: String(content.coverVideo ?? fallback?.coverVideo ?? ""),
    gallery: strings(content.gallery, fallback?.gallery ?? (image ? [image] : [])),
    categorySlug: String(content.categorySlug ?? fallback?.categorySlug ?? ""),
    furnitureType: String(content.furnitureType ?? fallback?.furnitureType ?? "Furniture"),
    fullDescription: description,
    shortDescription: String(content.shortDescription ?? description),
    relatedSlugs: strings(content.relatedSlugs, fallback?.relatedSlugs),
    displayOrder: row.display_order ?? fallback?.displayOrder ?? 100,
    status: row.status === "published" ? "published" : "draft",
    seoTitle: String(content.seoTitle ?? row.title),
    seoDescription: String(content.seoDescription ?? description),
    updatedAt: row.updated_at?.slice(0, 10) ?? fallback?.updatedAt ?? "2026-08-26",
  };
}

export function projectFromRow(row: ContentRow, fallback?: Project): Project {
  const content = row.content || {};
  const coverImage = String(content.coverImage ?? row.image_url ?? fallback?.coverImage ?? "");

  return {
    ...fallback,
    ...content,
    slug: row.slug,
    title: row.title,
    clientName: String(content.clientName ?? fallback?.clientName ?? row.title),
    sector: String(content.sector ?? fallback?.sector ?? "Commercial"),
    location: String(content.location ?? fallback?.location ?? ""),
    coverImage: row.image_url ?? coverImage,
    coverVideo: String(content.coverVideo ?? fallback?.coverVideo ?? ""),
    gallery: strings(content.gallery, fallback?.gallery ?? (coverImage ? [coverImage] : [])),
    description: String(content.description ?? fallback?.description ?? ""),
    scope: strings(content.scope, fallback?.scope),
    categories: strings(content.categories, fallback?.categories),
    relatedProductSlugs: strings(content.relatedProductSlugs, fallback?.relatedProductSlugs),
    displayOrder: row.display_order ?? fallback?.displayOrder ?? 100,
    seoTitle: String(content.seoTitle ?? row.title),
    seoDescription: String(content.seoDescription ?? content.description ?? fallback?.description ?? ""),
    updatedAt: row.updated_at?.slice(0, 10) ?? fallback?.updatedAt ?? "2026-08-26",
  };
}

export function mergeCatalogue<T extends { slug: string; displayOrder: number }>(
  seeds: T[],
  rows: ContentRow[],
  overrides: string[],
  fromRow: (row: ContentRow, fallback?: T) => T,
) {
  const originals = new Map(seeds.map((item) => [item.slug, item]));
  const merged = new Map(originals);
  // A saved override owns the original item even when renamed, unpublished or deleted.
  for (const slug of [...overrides, ...rows.map(sourceSlug)]) merged.delete(slug);
  for (const row of rows) {
    if (row.status === "published" && !row.content?._deleted) {
      merged.set(row.slug, fromRow(row, originals.get(sourceSlug(row))));
    }
  }
  return [...merged.values()].sort((a, b) => a.displayOrder - b.displayOrder);
}
