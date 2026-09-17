"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Filter, ImageIcon, Search } from "lucide-react";
import { AdminDeleteForm } from "@/components/admin-delete-form";
import { AdminRecordForm } from "@/components/admin-record-form";
import type { AdminResource, AdminRow } from "@/lib/admin";
import { isVideoMedia } from "@/lib/admin-media";
import { sourceSlug } from "@/lib/catalogue-records";

type SortMode = "newest" | "oldest" | "az" | "za" | "display";

function uniqueOptions(rows: AdminRow[], key: string) {
  return Array.from(
    new Set(
      rows
        .map((row) => row.content?.[key])
        .filter((value): value is string => typeof value === "string" && value.trim().length > 0),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

function rowTime(row: AdminRow) {
  return new Date(row.updatedAt || row.createdAt || 0).getTime();
}

function RecordEditor({ record, resource }: { record: AdminRow; resource: AdminResource }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="overflow-hidden rounded-lg border border-[#E6DDD1] bg-white">
      <button
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left text-[#1E3A8A] hover:bg-[#EAF6F5]/40"
        onClick={() => setOpen(!open)} type="button"
      >
        <span className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#FCFBF8]">
          {record.imageUrl && isVideoMedia(record.imageUrl) ? (
            <video className="h-full w-full object-contain p-2" muted playsInline preload="metadata" src={record.imageUrl} />
          ) : record.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className="h-full w-full object-contain p-2" loading="lazy" src={record.imageUrl} />
          ) : <ImageIcon aria-hidden="true" className="h-6 w-6 text-[#026670]" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block break-words text-base font-bold">{record.title}</span>
          <span className="mt-1 block text-sm text-[#026670]">{record.status === "published" ? "Published" : "Draft"}</span>
        </span>
        <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="space-y-4 border-t border-[#E6DDD1] p-3 sm:p-4">
          <AdminRecordForm record={record} resource={resource} />
          <div className="flex flex-wrap items-center justify-between gap-4">
            {record.status === "published" ? (
              <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[#026670]" href={`/${resource.slug === "products" ? "product" : "projects"}/${record.slug}`} target="_blank">
                <ExternalLink aria-hidden="true" className="h-4 w-4" /> View on website
              </Link>
            ) : null}
            {!record.isSeed ? (
              <AdminDeleteForm
                className="h-11 rounded-full border border-[#9d3f28] px-5 text-sm font-bold text-[#9d3f28] hover:bg-[#9d3f28] hover:text-white"
                confirmMessage={`Do you want to delete ${record.title}?`} id={record.id}
                label="Delete Record" resource={resource.slug}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function AdminCatalogueList({ rows, resource }: { rows: AdminRow[]; resource: AdminResource }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const [category, setCategory] = useState("");
  const [furnitureType, setFurnitureType] = useState("");
  const [sector, setSector] = useState("");
  const isProducts = resource.slug === "products";
  const isProjects = resource.slug === "projects";
  const categoryOptions = useMemo(() => uniqueOptions(rows, "categorySlug"), [rows]);
  const typeOptions = useMemo(() => uniqueOptions(rows, "furnitureType"), [rows]);
  const sectorOptions = useMemo(() => uniqueOptions(rows, "sector"), [rows]);
  const filtered = rows
    .filter((row) => {
      const haystack = [
        row.title,
        row.slug,
        row.status,
        row.content?.categorySlug,
        row.content?.furnitureType,
        row.content?.sku,
        row.content?.clientName,
        row.content?.sector,
        row.content?.location,
      ].join(" ").toLowerCase();
      return (!status || row.status === status) &&
        (!category || row.content?.categorySlug === category) &&
        (!furnitureType || row.content?.furnitureType === furnitureType) &&
        (!sector || row.content?.sector === sector) &&
        haystack.includes(search.trim().toLowerCase());
    })
    .sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "za") return b.title.localeCompare(a.title);
      if (sort === "oldest") return rowTime(a) - rowTime(b);
      if (sort === "display") return (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999);
      return rowTime(b) - rowTime(a) || (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
    });
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#E6DDD1] bg-white p-4 shadow-[0_16px_45px_rgba(32,34,56,0.05)]">
        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-[#026670]">
          <Filter aria-hidden="true" className="h-4 w-4" />
          Filter records
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-3.5 h-5 w-5 text-[#026670]" />
          <input aria-label={`Search ${resource.label.toLowerCase()}`} className="h-12 w-full rounded-lg border border-[#D9D2C8] bg-white pl-10 pr-4 text-[#1E3A8A]" onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${resource.label.toLowerCase()}`} type="search" value={search} />
        </label>
        <select aria-label="Filter by status" className="h-12 rounded-lg border border-[#D9D2C8] bg-white px-4 text-[#1E3A8A]" onChange={(event) => setStatus(event.target.value)} value={status}>
          <option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option>
        </select>
          <select aria-label="Sort records" className="h-12 rounded-lg border border-[#D9D2C8] bg-white px-4 text-[#1E3A8A]" onChange={(event) => setSort(event.target.value as SortMode)} value={sort}>
            <option value="newest">Newer top</option>
            <option value="oldest">Oldest top</option>
            <option value="az">Alphabet A-Z</option>
            <option value="za">Alphabet Z-A</option>
            <option value="display">Website order</option>
          </select>
          {isProducts ? (
            <>
              <select aria-label="Filter by furniture type" className="h-12 rounded-lg border border-[#D9D2C8] bg-white px-4 text-[#1E3A8A]" onChange={(event) => setFurnitureType(event.target.value)} value={furnitureType}>
                <option value="">All furniture types</option>
                {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <select aria-label="Filter by category" className="h-12 rounded-lg border border-[#D9D2C8] bg-white px-4 text-[#1E3A8A]" onChange={(event) => setCategory(event.target.value)} value={category}>
                <option value="">All categories</option>
                {categoryOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </>
          ) : null}
          {isProjects ? (
            <select aria-label="Filter by sector" className="h-12 rounded-lg border border-[#D9D2C8] bg-white px-4 text-[#1E3A8A]" onChange={(event) => setSector(event.target.value)} value={sector}>
              <option value="">All sectors</option>
              {sectorOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          ) : null}
        </div>
        <p className="mt-3 text-sm font-semibold text-[#1E3A8A]">
          Showing {filtered.length} of {rows.length}
        </p>
      </div>
      {filtered.map((record) => <RecordEditor key={sourceSlug(record)} record={record} resource={resource} />)}
      {!filtered.length ? <p className="py-6 text-[#1E3A8A]">No matching records.</p> : null}
    </div>
  );
}
