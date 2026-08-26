import Link from "next/link";
import { notFound } from "next/navigation";

import {
  deleteAdminRecord,
  logoutAdmin,
  updateLeadStatus,
} from "@/app/admin/actions";
import { AdminRecordForm } from "@/components/admin-record-form";
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
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6">
          <h1 className="text-3xl font-semibold text-[#202238]">
            Admin setup required
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#625f5a]">
            Configure Supabase before managing {resource.label}.
          </p>
        </div>
      </main>
    );
  }

  if (!isAdminRole(context.role)) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6">
          <h1 className="text-3xl font-semibold text-[#202238]">
            Access restricted
          </h1>
        </div>
      </main>
    );
  }

  const rows = await getAdminRows(resource);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-[#DED7CF] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            className="text-sm font-semibold text-[#C56545] hover:text-[#202238]"
            href="/admin"
          >
            Back to dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-[#202238]">
            {resource.label}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#625f5a]">
            {resource.description}
          </p>
        </div>
        <form action={logoutAdmin}>
          <button
            className="inline-flex h-11 items-center justify-center rounded-[4px] border border-[#DED7CF] bg-[#FCFBF8] px-4 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </header>

      {resource.kind === "content" ? (
        <section className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-[#202238]">
              Add new record
            </h2>
            <AdminRecordForm resource={resource} />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#202238]">
              Existing records
            </h2>
            {rows.length ? (
              rows.map((row) => (
                <details
                  className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-4"
                  key={row.id}
                >
                  <summary className="cursor-pointer text-sm font-semibold text-[#202238]">
                    {row.title}{" "}
                    <span className="text-[#7b746e]">({row.status})</span>
                  </summary>
                  <div className="mt-4 space-y-4">
                    <AdminRecordForm record={row} resource={resource} />
                    <form action={deleteAdminRecord}>
                      <input name="resource" type="hidden" value={resource.slug} />
                      <input name="id" type="hidden" value={row.id} />
                      <button
                        className="h-11 rounded-[4px] border border-[#9d3f28] px-4 text-sm font-semibold text-[#9d3f28] hover:bg-[#9d3f28] hover:text-white"
                        type="submit"
                      >
                        Delete record
                      </button>
                    </form>
                  </div>
                </details>
              ))
            ) : (
              <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6 text-sm text-[#625f5a]">
                No records yet.
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="mt-8">
          <div className="overflow-hidden rounded-lg border border-[#DED7CF] bg-[#FCFBF8]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#F5F1EA] text-xs uppercase tracking-[0.12em] text-[#7b746e]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DED7CF]">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-[#202238]">{row.name}</p>
                      <p className="mt-1 max-w-xs text-[#625f5a]">
                        {row.message}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top text-[#625f5a]">
                      <p>{row.phone}</p>
                      <p>{row.email}</p>
                    </td>
                    <td className="px-4 py-4 align-top text-[#625f5a]">
                      {row.products?.length ? row.products.join(", ") : "None"}
                    </td>
                    <td className="px-4 py-4 align-top text-[#625f5a]">
                      {row.sourcePath}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <form action={updateLeadStatus} className="flex gap-2">
                        <input
                          name="resource"
                          type="hidden"
                          value={resource.slug}
                        />
                        <input name="id" type="hidden" value={row.id} />
                        <select
                          className="h-10 rounded-[4px] border border-[#DED7CF] bg-white px-2"
                          defaultValue={row.status}
                          name="status"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          className="h-10 rounded-[4px] bg-[#202238] px-3 text-xs font-semibold text-white hover:bg-[#C56545]"
                          type="submit"
                        >
                          Update
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

