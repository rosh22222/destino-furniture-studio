"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Filter, Mail, MapPin, Phone, Search } from "lucide-react";

import { updateLeadStatus } from "@/app/admin/actions";
import { AdminDeleteForm } from "@/components/admin-delete-form";
import type { AdminResource, AdminRow } from "@/lib/admin";

type SortMode = "newest" | "oldest" | "az" | "za";

function rowTime(row: AdminRow) {
  return new Date(row.createdAt || 0).getTime();
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export function AdminEnquiryList({ rows, resource }: { rows: AdminRow[]; resource: AdminResource }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [leadType, setLeadType] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const leadTypes = useMemo(() => unique(rows.map((row) => row.leadType || "Enquiry")), [rows]);
  const statuses = useMemo(() => unique(rows.map((row) => row.status)), [rows]);
  const filtered = rows
    .filter((row) => {
      const haystack = [
        row.name,
        row.phone,
        row.email,
        row.company,
        row.location,
        row.message,
        row.sourcePath,
        row.products?.join(" "),
        row.project,
        row.leadType,
        row.status,
      ].join(" ").toLowerCase();
      return (!status || row.status === status) &&
        (!leadType || row.leadType === leadType) &&
        haystack.includes(search.trim().toLowerCase());
    })
    .sort((a, b) => {
      if (sort === "az") return (a.name || a.title).localeCompare(b.name || b.title);
      if (sort === "za") return (b.name || b.title).localeCompare(a.name || a.title);
      if (sort === "oldest") return rowTime(a) - rowTime(b);
      return rowTime(b) - rowTime(a);
    });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#E6DDD1] bg-white p-4 shadow-[0_16px_45px_rgba(32,34,56,0.05)]">
        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-[#026670]">
          <Filter aria-hidden="true" className="h-4 w-4" />
          Filter enquiries
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="relative">
            <Search aria-hidden="true" className="absolute left-3 top-3.5 h-5 w-5 text-[#026670]" />
            <input
              aria-label="Search enquiries"
              className="h-12 w-full rounded-lg border border-[#D9D2C8] bg-white pl-10 pr-4 text-[#1E3A8A]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone, product, city"
              type="search"
              value={search}
            />
          </label>
          <select aria-label="Filter enquiries by status" className="h-12 rounded-lg border border-[#D9D2C8] bg-white px-4 text-[#1E3A8A]" onChange={(event) => setStatus(event.target.value)} value={status}>
            <option value="">All statuses</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select aria-label="Filter enquiries by type" className="h-12 rounded-lg border border-[#D9D2C8] bg-white px-4 text-[#1E3A8A]" onChange={(event) => setLeadType(event.target.value)} value={leadType}>
            <option value="">All enquiry types</option>
            {leadTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select aria-label="Sort enquiries" className="h-12 rounded-lg border border-[#D9D2C8] bg-white px-4 text-[#1E3A8A]" onChange={(event) => setSort(event.target.value as SortMode)} value={sort}>
            <option value="newest">Newer top</option>
            <option value="oldest">Oldest top</option>
            <option value="az">Alphabet A-Z</option>
            <option value="za">Alphabet Z-A</option>
          </select>
        </div>
        <p className="mt-3 text-sm font-semibold text-[#1E3A8A]">
          Showing {filtered.length} of {rows.length}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((row) => (
          <article
            className="rounded-2xl border border-[#E6DDD1] bg-white p-5 shadow-[0_16px_45px_rgba(32,34,56,0.06)]"
            key={`${row.sourceTable}-${row.id}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#EAF6F5] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#026670]">
                    {row.leadType || "Enquiry"}
                  </span>
                  <span className="rounded-full bg-[#FFF3EA] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#C56545]">
                    {row.status}
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-extrabold text-[#1E3A8A]">
                  {row.name}
                </h2>
                {row.company ? (
                  <p className="mt-1 text-base font-semibold text-[#1E3A8A]">
                    {row.company}
                  </p>
                ) : null}
              </div>
              <form action={updateLeadStatus} className="flex gap-2">
                <input name="resource" type="hidden" value={resource.slug} />
                <input name="id" type="hidden" value={row.id} />
                <input name="sourceTable" type="hidden" value={row.sourceTable || ""} />
                <select
                  className="h-10 rounded-full border border-[#D9D2C8] bg-[#FCFBF8] px-3 text-sm font-bold text-[#1E3A8A] outline-none focus:border-[#026670]"
                  defaultValue={row.status}
                  name="status"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed</option>
                </select>
                <button
                  className="h-10 rounded-full bg-[#026670] px-4 text-sm font-extrabold text-white transition hover:bg-[#1E3A8A]"
                  type="submit"
                >
                  Save
                </button>
              </form>
            </div>

            <div className="mt-5 grid gap-3 text-base font-medium leading-7 text-[#1E3A8A] sm:grid-cols-2">
              <a className="inline-flex items-center gap-2 hover:text-[#C56545]" href={`tel:${row.phone}`}>
                <Phone aria-hidden="true" className="h-4 w-4 text-[#026670]" />
                {row.phone}
              </a>
              {row.email ? (
                <a className="inline-flex items-center gap-2 hover:text-[#C56545]" href={`mailto:${row.email}`}>
                  <Mail aria-hidden="true" className="h-4 w-4 text-[#026670]" />
                  {row.email}
                </a>
              ) : null}
              {row.location ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin aria-hidden="true" className="h-4 w-4 text-[#026670]" />
                  {row.location}
                </span>
              ) : null}
              {row.createdAt ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarClock aria-hidden="true" className="h-4 w-4 text-[#026670]" />
                  {new Date(row.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              ) : null}
            </div>

            <div className="mt-5 rounded-xl bg-[#FCFBF8] p-4">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#C56545]">
                Requirement
              </p>
              <p className="mt-2 whitespace-pre-line text-base font-medium leading-7 text-[#1E3A8A]">
                {row.message}
              </p>
            </div>

            <div className="mt-4 grid gap-3 text-sm font-semibold leading-6 text-[#1E3A8A]">
              {row.products?.length ? (
                <p>
                  Products: <span className="font-medium">{row.products.join(", ")}</span>
                </p>
              ) : null}
              {row.project ? (
                <p>
                  Project: <span className="font-medium">{row.project}</span>
                </p>
              ) : null}
              {row.sourcePath ? (
                <p>
                  Source page: <span className="font-medium">{row.sourcePath}</span>
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex justify-end border-t border-[#E6DDD1] pt-4">
              <AdminDeleteForm
                className="h-10 rounded-full border border-[#9d3f28] px-4 text-sm font-extrabold uppercase tracking-[0.1em] text-[#9d3f28] transition hover:bg-[#9d3f28] hover:text-white"
                confirmMessage={`Do you want to delete enquiry from ${row.name}?`}
                id={row.id}
                label="Delete Enquiry"
                resource={resource.slug}
                sourceTable={row.sourceTable}
              />
            </div>
          </article>
        ))}
      </div>
      {!filtered.length ? <p className="py-6 text-[#1E3A8A]">No matching enquiries.</p> : null}
    </div>
  );
}
