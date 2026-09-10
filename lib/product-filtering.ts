import type { Product } from "@/lib/types";

const standardProductTypes = [
  "Chairs",
  "Tables",
  "Storage",
  "Metal Series",
  "Recliners",
  "Swings",
  "Sofas",
];

const hiddenCustomizedProductSlugs = ["lounge-and-visitor-seating"];

export type NormalizedProductFilters = {
  q: string;
  category: string;
  brand: string;
  type: string;
  sort: string;
  page: number;
};

export function normalizeProductFilters(
  searchParams?: Record<string, string | string[] | undefined>,
): NormalizedProductFilters {
  const value = (key: string) => {
    const raw = searchParams?.[key];
    return Array.isArray(raw) ? raw[0] || "" : raw || "";
  };

  const page = Number.parseInt(value("page"), 10);

  return {
    q: value("q").trim(),
    category: value("category").trim(),
    brand: value("brand").trim(),
    type: value("type").trim(),
    sort: value("sort").trim() || "featured",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function filterProducts(
  products: Product[],
  filters: NormalizedProductFilters,
) {
  const query = filters.q.toLowerCase();

  const filtered = products.filter((product) => {
    const matchesQuery = query
      ? [
          product.name,
          product.shortDescription,
          product.fullDescription,
          product.furnitureType,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;

    const matchesCategory = filters.category
      ? product.categorySlug === filters.category
      : true;
    const matchesBrand = filters.brand
      ? product.brandSlug === filters.brand
      : true;
    const matchesType = filters.type
      ? filters.type === "Customized"
        ? !hiddenCustomizedProductSlugs.includes(product.slug) &&
          !standardProductTypes.includes(product.furnitureType)
        : product.furnitureType === filters.type
      : true;

    return matchesQuery && matchesCategory && matchesBrand && matchesType;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "name") {
      return a.name.localeCompare(b.name);
    }
    if (filters.sort === "category") {
      return a.categorySlug.localeCompare(b.categorySlug);
    }
    return Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder;
  });
}

export function hasActiveProductFilters(filters: NormalizedProductFilters) {
  return Boolean(
    filters.q ||
      filters.category ||
      filters.brand ||
      filters.type ||
      (filters.sort && filters.sort !== "featured") ||
      filters.page > 1,
  );
}
