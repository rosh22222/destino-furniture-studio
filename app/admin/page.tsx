import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  FolderKanban,
  ImageIcon,
  LogOut,
  Package,
} from "lucide-react";

import { logoutAdmin } from "@/app/admin/actions";
import { AdminAccountForm } from "@/components/admin-account-form";
import { adminResources, getAdminContext, isAdminRole } from "@/lib/admin";

function AdminSetupNotice() {
  return (
    <main className="min-h-screen bg-[#FFF9F5] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#E6DDD1] bg-white p-8 shadow-[0_24px_60px_rgba(32,34,56,0.08)]">
        <h1 className="[font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase tracking-[0.04em] text-[#026670]">
          Admin setup required
        </h1>
        <p className="mt-4 text-base font-medium leading-7 text-[#1E3A8A]">
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
      <main className="min-h-screen bg-[#FFF9F5] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#E6DDD1] bg-white p-8 shadow-[0_24px_60px_rgba(32,34,56,0.08)]">
          <h1 className="[font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase tracking-[0.04em] text-[#026670]">
            Admin dashboard
          </h1>
          <p className="mt-4 text-base font-medium leading-7 text-[#1E3A8A]">
            Sign in to manage Destino website content.
          </p>
          <Link
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#026670] px-7 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_rgba(2,102,112,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1E3A8A]"
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
      <main className="min-h-screen bg-[#FFF9F5] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#E6DDD1] bg-white p-8 shadow-[0_24px_60px_rgba(32,34,56,0.08)]">
          <h1 className="[font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase tracking-[0.04em] text-[#026670]">
            Access restricted
          </h1>
          <p className="mt-4 text-base font-medium leading-7 text-[#1E3A8A]">
            Your account is authenticated but does not have an admin or editor
            role in `profiles`.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9F5] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-7xl rounded-[2rem] border border-[#E6DDD1] bg-white p-6 shadow-[0_24px_70px_rgba(32,34,56,0.08)] sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Image
              alt="Destino Furniture Studio logo"
              className="h-auto w-40 object-contain sm:w-52"
              height={95}
              priority
              src="/images/logo/logo_destino.png"
              width={220}
            />
            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.22em] text-[#C56545]">
              Welcome To
            </p>
            <h1 className="mt-3 [font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase leading-none tracking-[0.04em] text-[#026670] sm:text-5xl">
              Destino Furniture Studio
            </h1>
            <p className="mt-4 text-2xl font-extrabold text-[#1E3A8A]">
              Manikanta Pradeep
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

      <section className="mx-auto mt-8 grid max-w-7xl gap-5 md:grid-cols-3">
        {adminResources.map((resource) => (
          <Link
            className="group relative overflow-hidden rounded-2xl border border-[#E6DDD1] bg-white p-6 shadow-[0_18px_50px_rgba(32,34,56,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#026670]/35 hover:shadow-[0_26px_65px_rgba(2,102,112,0.14)]"
            href={`/admin/${resource.slug}`}
            key={resource.slug}
          >
            <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#026670]/45 to-transparent" />
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6F5] text-[#026670] transition group-hover:bg-[#026670] group-hover:text-white">
              {resource.slug === "products" ? (
                <Package aria-hidden="true" className="h-6 w-6" />
              ) : resource.slug === "projects" ? (
                <FolderKanban aria-hidden="true" className="h-6 w-6" />
              ) : (
                <ImageIcon aria-hidden="true" className="h-6 w-6" />
              )}
            </span>
            <div className="mt-7 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1E3A8A]">
                  {resource.label}
                </h2>
                <p className="mt-3 text-base font-medium leading-7 text-[#1E3A8A]">
                  {resource.description}
                </p>
              </div>
              <ArrowUpRight
                aria-hidden="true"
                className="mt-1 h-5 w-5 shrink-0 text-[#C56545] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </Link>
        ))}
      </section>

      <div className="mx-auto max-w-7xl">
        <AdminAccountForm email={context.user.email} />
      </div>
    </main>
  );
}
