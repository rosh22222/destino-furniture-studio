"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";

import { loginAdmin, type AdminActionState } from "@/app/admin/actions";

const initialState: AdminActionState = {
  ok: false,
  message: "",
};

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initialState);

  return (
    <form
      action={action}
      className="mx-auto w-full max-w-md rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-6"
    >
      <h1 className="text-2xl font-semibold text-[#202238]">Admin login</h1>
      <p className="mt-2 text-sm leading-6 text-[#625f5a]">
        Sign in with a Supabase Auth user whose profile role is admin or editor.
      </p>
      <div className="mt-6 space-y-4">
        <label className="block space-y-2 text-sm font-medium text-[#29282D]">
          Email
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            name="email"
            required
            type="email"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium text-[#29282D]">
          Password
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            name="password"
            required
            type="password"
          />
        </label>
      </div>
      <button
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-5 text-sm font-semibold text-white hover:bg-[#C56545] disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        <LogIn aria-hidden="true" className="h-4 w-4" />
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {state.message ? (
        <p className="mt-4 text-sm text-[#9d3f28]" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

