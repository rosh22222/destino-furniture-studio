import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, LogOut, Mail, MapPin, Phone } from "lucide-react";

import { logoutAdmin, updateLeadStatus } from "@/app/admin/actions";
import { AdminDeleteForm } from "@/components/admin-delete-form";
import { AdminRecordForm } from "@/components/admin-record-form";
import { AdminCatalogueList } from "@/components/admin-catalogue-list";
import {
  getAdminResource,
  getAdminRows,
  isAdminRole,
  requireAdmin,
} from "@/lib/admin";

type AdminResourcePageProps = {
  params: Promise<{ resource: string }>;
};

export default async function AdminResourcePage({
  params,
}: AdminResourcePageProps) {
  const { resource: resourceSlug } = await params;
  const resource = getAdminResource(resourceSlug);

  if (!resource) {
    notFound();
  }

  const context = await requireAdmin();

  if (!context.configured) {
    return (
      <main className="min-h-screen bg-[#FFF9F5] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#E6DDD1] bg-white p-8 shadow-[0_24px_60px_rgba(32,34,56,0.08)]">
          <h1 className="[font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase tracking-[0.04em] text-[#026670]">
            Admin setup required
          </h1>
          <p className="mt-4 text-base font-medium leading-7 text-[#1E3A8A]">
            Configure Supabase before managing {resource.label}.
          </p>
        </div>
      </main>
    );
  }

  if (!isAdminRole(context.role)) {
    return (
      <main className="min-h-screen bg-[#FFF9F5] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#E6DDD1] bg-white p-8 shadow-[0_24px_60px_rgba(32,34,56,0.08)]">
          <h1 className="[font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase tracking-[0.04em] text-[#026670]">
            Access restricted
          </h1>
        </div>
      </main>
    );
  }

  let rows;
  try {
    rows = await getAdminRows(resource);
  } catch {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-[#1E3A8A]">
        <h1 className="text-2xl font-semibold text-[#026670]">Unable to load {resource.label.toLowerCase()}</h1>
        <p className="mt-3">Your records could not be loaded. Please refresh and try again.</p>
        <Link className="mt-5 inline-block underline" href={`/admin/${resource.slug}`}>Try again</Link>
      </main>
    );
  }
  const isClientsAdmin = resource.slug === "clients";
  const isLeadAdmin = resource.kind === "lead";
  const addTitle = isClientsAdmin ? "Upload Client Logo" : `Add ${resource.label.slice(0, -1)}`;
  const existingTitle = isLeadAdmin
    ? "Submitted Enquiries"
    : isClientsAdmin
      ? "Existing Logos"
      : `Existing ${resource.label}`;

  return (
    <main className="min-h-screen bg-[#FFF9F5] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-7xl rounded-[2rem] border border-[#E6DDD1] bg-white p-6 shadow-[0_24px_70px_rgba(32,34,56,0.08)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link
              className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-[#C56545] transition hover:text-[#1E3A8A]"
              href="/admin"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Dashboard
            </Link>
            <h1 className="mt-4 [font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase leading-none tracking-[0.04em] text-[#026670] sm:text-5xl">
              {resource.label}
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#1E3A8A]">
              {resource.description}
            </p>
            <div className="mt-5 h-0.5 w-20 bg-[#C56545]" />
          </div>
          <form action={logoutAdmin}>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#E6DDD1] bg-[#FCFBF8] px-5 text-sm font-extrabold uppercase tracking-[0.1em] text-[#1E3A8A] transition hover:border-[#C56545] hover:text-[#C56545]"
              type="submit"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto mt-8 grid max-w-7xl gap-10">
        {!isLeadAdmin ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#C56545]">
                Create
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#1E3A8A]">
                {addTitle}
              </h2>
            </div>
            <AdminRecordForm resource={resource} />
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#C56545]">
                Manage
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#1E3A8A]">
                {existingTitle}
              </h2>
            </div>
            <span className="rounded-full bg-[#EAF6F5] px-4 py-2 text-sm font-extrabold text-[#026670]">
              {rows.length} saved
            </span>
          </div>

          {rows.length ? (
            isLeadAdmin ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {rows.map((row) => (
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
            ) : isClientsAdmin ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((row) => (
                  <div
                    className="rounded-2xl border border-[#E6DDD1] bg-white p-4 shadow-[0_16px_45px_rgba(32,34,56,0.06)]"
                    key={row.id}
                  >
                    <div className="flex min-h-40 items-center justify-center rounded-xl bg-[#FCFBF8] p-5">
                      {row.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={row.imageAlt || `${row.title} logo`}
                          className="max-h-28 max-w-full object-contain"
                          src={row.imageUrl}
                        />
                      ) : (
                        <span className="text-sm font-extrabold text-[#1E3A8A]">
                          {row.title}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="line-clamp-1 text-sm font-extrabold text-[#1E3A8A]">
                        {row.title}
                      </p>
                      <AdminDeleteForm
                        className="h-10 rounded-full border border-[#9d3f28] px-4 text-sm font-extrabold text-[#9d3f28] transition hover:bg-[#9d3f28] hover:text-white"
                        confirmMessage={`Do you want to delete ${row.title}?`}
                        id={row.id}
                        resource={resource.slug}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <AdminCatalogueList rows={rows} resource={resource} />
            )
          ) : (
            <div className="rounded-2xl border border-[#E6DDD1] bg-white p-8 text-base font-medium leading-7 text-[#1E3A8A] shadow-[0_16px_45px_rgba(32,34,56,0.06)]">
              No records yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
