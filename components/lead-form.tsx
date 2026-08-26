"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

import { submitLead, type LeadFormState } from "@/app/actions";
import { cn } from "@/lib/utils";

const initialState: LeadFormState = {
  ok: false,
  message: "",
};

type LeadFormProps = {
  intent: "general" | "quote" | "project" | "location";
  sourcePath: string;
  products?: string[];
  project?: string;
  title?: string;
  compact?: boolean;
};

function fieldError(
  state: LeadFormState,
  field: keyof NonNullable<LeadFormState["fieldErrors"]>,
) {
  return state.fieldErrors?.[field]?.[0];
}

export function LeadForm({
  intent,
  sourcePath,
  products = [],
  project,
  title = "Request a quotation",
  compact,
}: LeadFormProps) {
  const [state, action, pending] = useActionState(submitLead, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form
      action={action}
      className={cn(
        "rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5",
        !compact && "md:p-6",
      )}
      ref={formRef}
    >
      <input name="intent" type="hidden" value={intent} />
      <input name="sourcePath" type="hidden" value={sourcePath} />
      {products.map((product) => (
        <input key={product} name="products" type="hidden" value={product} />
      ))}
      {project ? <input name="project" type="hidden" value={project} /> : null}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-[#202238]">{title}</h2>
        {products.length ? (
          <p className="mt-2 text-sm leading-6 text-[#625f5a]">
            Selected: {products.join(", ")}
          </p>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Name
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base outline-none transition focus:border-[#C56545] focus:ring-2 focus:ring-[#C56545]/20"
            name="name"
            required
          />
          {fieldError(state, "name") ? (
            <span className="block text-xs text-[#9d3f28]">
              {fieldError(state, "name")}
            </span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Phone
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base outline-none transition focus:border-[#C56545] focus:ring-2 focus:ring-[#C56545]/20"
            name="phone"
            required
            type="tel"
          />
          {fieldError(state, "phone") ? (
            <span className="block text-xs text-[#9d3f28]">
              {fieldError(state, "phone")}
            </span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Email
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base outline-none transition focus:border-[#C56545] focus:ring-2 focus:ring-[#C56545]/20"
            name="email"
            type="email"
          />
          {fieldError(state, "email") ? (
            <span className="block text-xs text-[#9d3f28]">
              {fieldError(state, "email")}
            </span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Company
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base outline-none transition focus:border-[#C56545] focus:ring-2 focus:ring-[#C56545]/20"
            name="company"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D] md:col-span-2">
          City or project location
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base outline-none transition focus:border-[#C56545] focus:ring-2 focus:ring-[#C56545]/20"
            name="location"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D] md:col-span-2">
          Requirement
          <textarea
            className="min-h-32 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 py-3 text-base outline-none transition focus:border-[#C56545] focus:ring-2 focus:ring-[#C56545]/20"
            name="message"
            required
          />
          {fieldError(state, "message") ? (
            <span className="block text-xs text-[#9d3f28]">
              {fieldError(state, "message")}
            </span>
          ) : null}
        </label>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-5 text-sm font-semibold text-white transition hover:bg-[#C56545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          <Send aria-hidden="true" className="h-4 w-4" />
          {pending ? "Sending..." : "Send enquiry"}
        </button>
        {state.message ? (
          <p
            className={cn(
              "text-sm leading-6",
              state.ok ? "text-[#355b3d]" : "text-[#9d3f28]",
            )}
            role="status"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

