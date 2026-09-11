"use client";

import { deleteAdminRecord } from "@/app/admin/actions";

export function AdminDeleteForm({
  resource,
  id,
  label = "Delete",
  confirmMessage = "Do you want to delete this record?",
  className,
}: {
  resource: string;
  id: string;
  label?: string;
  confirmMessage?: string;
  className?: string;
}) {
  return (
    <form
      action={deleteAdminRecord}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input name="resource" type="hidden" value={resource} />
      <input name="id" type="hidden" value={id} />
      <button className={className} type="submit">
        {label}
      </button>
    </form>
  );
}
