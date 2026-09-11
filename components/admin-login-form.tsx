"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react";

import { loginAdmin, type AdminActionState } from "@/app/admin/actions";

const initialState: AdminActionState = {
  ok: false,
  message: "",
};

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      action={action}
      className="mx-auto w-full max-w-md rounded-[2rem] border border-[#E6DDD1] bg-white p-7 shadow-[0_26px_70px_rgba(32,34,56,0.10)]"
    >
      <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#C56545]">
        Destino Admin
      </p>
      <h1 className="mt-3 [font-family:var(--font-collection-heading)] text-4xl font-extrabold uppercase leading-none tracking-[0.04em] text-[#026670]">
        CMS Login
      </h1>
      <p className="mt-4 text-base font-medium leading-7 text-[#1E3A8A]">
        Sign in with a Supabase Auth user whose profile role is admin or editor.
      </p>
      <div className="mt-6 space-y-4">
        <label className="block space-y-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#026670]">
          Email
          <span className="relative block">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#026670]"
            />
            <input
              className="h-12 w-full rounded-lg border border-[#D9D2C8] bg-[#FCFBF8] pl-11 pr-4 text-base font-medium text-[#1E3A8A] outline-none transition focus:border-[#026670] focus:ring-4 focus:ring-[#026670]/10"
              name="email"
              required
              type="email"
            />
          </span>
        </label>
        <label className="block space-y-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#026670]">
          Password
          <span className="relative block">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#026670]"
            />
            <input
              className="h-12 w-full rounded-lg border border-[#D9D2C8] bg-[#FCFBF8] pl-11 pr-12 text-base font-medium text-[#1E3A8A] outline-none transition focus:border-[#026670] focus:ring-4 focus:ring-[#026670]/10"
              name="password"
              required
              type={showPassword ? "text" : "password"}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#026670] transition hover:bg-[#EAF6F5] hover:text-[#1E3A8A]"
              onClick={() => setShowPassword((value) => !value)}
              type="button"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Eye aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          </span>
        </label>
      </div>
      <button
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#026670] px-5 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_rgba(2,102,112,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1E3A8A] disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        <LogIn aria-hidden="true" className="h-4 w-4" />
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {state.message ? (
        <p className="mt-4 rounded-lg bg-[#FFF1EC] px-4 py-3 text-sm font-bold text-[#9d3f28]" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
