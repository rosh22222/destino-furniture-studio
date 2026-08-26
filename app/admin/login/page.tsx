import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminContext } from "@/lib/admin";

export default async function AdminLoginPage() {
  const context = await getAdminContext();

  if (context.configured && context.user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <AdminLoginForm />
    </main>
  );
}

