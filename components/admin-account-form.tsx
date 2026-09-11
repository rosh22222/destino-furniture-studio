"use client";

import { useActionState } from "react";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";

import { updateAdminAccount, type AdminActionState } from "@/app/admin/actions";

const initialState: AdminActionState = {
  ok: false,
  message: "",
};

export function AdminAccountForm({ email }: { email?: string | null }) {
  const [state, action, pending] = useActionState(updateAdminAccount, initialState);

  return (
    <form
      action={action}
      className="mt-8 rounded-2xl border border-[#E6DDD1] bg-white p-6 shadow-[0_18px_50px_rgba(32,34,56,0.07)]"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6F5] text-[#026670]">
          <ShieldCheck aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C56545]">
            Security
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-[#1E3A8A]">
            Admin account
          </h2>
          <p className="mt-1 text-base font-medium text-[#1E3A8A]">
            Update the email or password for the signed-in admin.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#026670]">
          New email
          <span className="relative block">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#026670]"
            />
            <input
              className="h-12 w-full rounded-lg border border-[#D9D2C8] bg-[#FCFBF8] pl-10 pr-3 text-base font-medium text-[#1E3A8A] outline-none transition focus:border-[#026670] focus:ring-4 focus:ring-[#026670]/10"
              defaultValue={email || ""}
              name="email"
              type="email"
            />
          </span>
        </label>
        <label className="space-y-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#026670]">
          New password
          <span className="relative block">
            <KeyRound
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#026670]"
            />
            <input
              className="h-12 w-full rounded-lg border border-[#D9D2C8] bg-[#FCFBF8] pl-10 pr-3 text-base font-medium text-[#1E3A8A] outline-none transition focus:border-[#026670] focus:ring-4 focus:ring-[#026670]/10"
              minLength={6}
              name="password"
              type="password"
            />
          </span>
        </label>
        <label className="space-y-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#026670]">
          Confirm password
          <input
            className="h-12 w-full rounded-lg border border-[#D9D2C8] bg-[#FCFBF8] px-3 text-base font-medium text-[#1E3A8A] outline-none transition focus:border-[#026670] focus:ring-4 focus:ring-[#026670]/10"
            minLength={6}
            name="confirmPassword"
            type="password"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#026670] px-7 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_rgba(2,102,112,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1E3A8A] disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Updating..." : "Update account"}
        </button>
        {state.message ? (
          <p
            className={
              state.ok
                ? "rounded-lg bg-[#EAF6F5] px-4 py-3 text-sm font-bold text-[#026670]"
                : "rounded-lg bg-[#FFF1EC] px-4 py-3 text-sm font-bold text-[#9d3f28]"
            }
            role="status"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
