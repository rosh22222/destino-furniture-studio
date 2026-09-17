import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";

import { logoutAdmin } from "@/app/admin/actions";
import { AdminDeleteForm } from "@/components/admin-delete-form";
import { AdminRecordForm } from "@/components/admin-record-form";
import { AdminCatalogueList } from "@/components/admin-catalogue-list";
import { AdminEnquiryList } from "@/components/admin-enquiry-list";
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
              <AdminEnquiryList rows={rows} resource={resource} />
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
