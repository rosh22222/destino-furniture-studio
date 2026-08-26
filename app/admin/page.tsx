import Link from "next/link";
import { Database, LogOut, Settings } from "lucide-react";

import { logoutAdmin } from "@/app/admin/actions";
import { adminResources, getAdminContext, isAdminRole } from "@/lib/admin";

function AdminSetupNotice() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6">
        <h1 className="text-3xl font-semibold text-[#202238]">
          Admin setup required
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#625f5a]">
          Add Supabase environment variables from `.env.example`, run the
          database migration and create an admin profile before using the
          dashboard.
        </p>
      </div>
    </main>
  );
}

export default async function AdminPage() {
  const context = await getAdminContext();

  if (!context.configured) {
    return <AdminSetupNotice />;
  }

  if (!context.user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6">
          <h1 className="text-3xl font-semibold text-[#202238]">
            Admin dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#625f5a]">
            Sign in to manage Destino website content.
          </p>
          <Link
            className="mt-5 inline-flex h-12 items-center justify-center rounded-[4px] bg-[#202238] px-5 text-sm font-semibold text-white hover:bg-[#C56545]"
            href="/admin/login"
          >
            Admin login
          </Link>
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
          <p className="mt-3 text-sm leading-6 text-[#625f5a]">
            Your account is authenticated but does not have an admin or editor
            role in `profiles`.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-[#DED7CF] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
            Destino Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#202238]">
            Content dashboard
          </h1>
          <p className="mt-2 text-sm text-[#625f5a]">
            Signed in as {context.user.email} with role {context.role}.
          </p>
        </div>
        <form action={logoutAdmin}>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[4px] border border-[#DED7CF] bg-[#FCFBF8] px-4 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
            type="submit"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminResources.map((resource) => (
          <Link
            className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5 transition hover:border-[#C56545]"
            href={`/admin/${resource.slug}`}
            key={resource.slug}
          >
            {resource.kind === "lead" ? (
              <Database aria-hidden="true" className="h-5 w-5 text-[#C56545]" />
            ) : (
              <Settings aria-hidden="true" className="h-5 w-5 text-[#C56545]" />
            )}
            <h2 className="mt-4 text-lg font-semibold text-[#202238]">
              {resource.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#625f5a]">
              {resource.description}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}

