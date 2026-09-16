"use client";

import { deleteAdminRecord } from "@/app/admin/actions";
import { useActionState } from "react";

export function AdminDeleteForm({
  resource,
  id,
  sourceTable,
  label = "Delete",
  confirmMessage = "Do you want to delete this record?",
  className,
}: {
  resource: string;
  id: string;
  sourceTable?: string;
  label?: string;
  confirmMessage?: string;
  className?: string;
}) {
  const [state, action, pending] = useActionState(deleteAdminRecord, { ok: false, message: "" });
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input name="resource" type="hidden" value={resource} />
      <input name="id" type="hidden" value={id} />
      {sourceTable ? (
        <input name="sourceTable" type="hidden" value={sourceTable} />
      ) : null}
      <button className={className} disabled={pending} type="submit">
        {pending ? "Deleting..." : label}
      </button>
      {state.message ? <p className="mt-2 text-sm text-[#9d3f28]" role="status">{state.message}</p> : null}
    </form>
  );
}
