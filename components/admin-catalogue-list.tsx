"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, ImageIcon, Search } from "lucide-react";
import { AdminDeleteForm } from "@/components/admin-delete-form";
import { AdminRecordForm } from "@/components/admin-record-form";
import type { AdminResource, AdminRow } from "@/lib/admin";
import { sourceSlug } from "@/lib/catalogue-records";

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
          {record.imageUrl ? (
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
  const filtered = rows.filter((row) => (!status || row.status === status) &&
    [row.title, row.slug, row.content?.categorySlug, row.content?.sku, row.content?.location]
      .join(" ").toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-3.5 h-5 w-5 text-[#026670]" />
          <input aria-label={`Search ${resource.label.toLowerCase()}`} className="h-12 w-full rounded-lg border border-[#D9D2C8] bg-white pl-10 pr-4 text-[#1E3A8A]" onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${resource.label.toLowerCase()}`} type="search" value={search} />
        </label>
        <select aria-label="Filter by status" className="h-12 rounded-lg border border-[#D9D2C8] bg-white px-4 text-[#1E3A8A]" onChange={(event) => setStatus(event.target.value)} value={status}>
          <option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option>
        </select>
      </div>
      {filtered.map((record) => <RecordEditor key={sourceSlug(record)} record={record} resource={resource} />)}
      {!filtered.length ? <p className="py-6 text-[#1E3A8A]">No matching records.</p> : null}
    </div>
  );
}
