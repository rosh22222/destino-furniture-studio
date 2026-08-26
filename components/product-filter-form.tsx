import { Search } from "lucide-react";

import type { Brand, Category } from "@/lib/types";

export type ProductFilters = {
  q?: string;
  category?: string;
  brand?: string;
  type?: string;
  sort?: string;
};

export function ProductFilterForm({
  categories,
  brands,
  types,
  filters,
}: {
  categories: Category[];
  brands: Brand[];
  types: string[];
  filters: ProductFilters;
}) {
  return (
    <form
      action="/products"
      className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-4"
      method="get"
    >
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr_auto]">
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Search
          <div className="flex h-12 items-center gap-2 rounded-[4px] border border-[#DED7CF] bg-white px-3">
            <Search aria-hidden="true" className="h-4 w-4 text-[#C56545]" />
            <input
              className="min-w-0 flex-1 bg-transparent text-base outline-none"
              defaultValue={filters.q}
              name="q"
              placeholder="Chair, table, workstation"
            />
          </div>
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Category
          <select
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            defaultValue={filters.category}
            name="category"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Brand
          <select
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            defaultValue={filters.brand}
            name="brand"
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Type
          <select
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            defaultValue={filters.type}
            name="type"
          >
            <option value="">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Sort
          <select
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            defaultValue={filters.sort || "featured"}
            name="sort"
          >
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
          </select>
        </label>
        <div className="flex items-end">
          <button
            className="h-12 w-full rounded-[4px] bg-[#202238] px-5 text-sm font-semibold text-white transition hover:bg-[#C56545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545]"
            type="submit"
          >
            Apply
          </button>
        </div>
      </div>
    </form>
  );
}

