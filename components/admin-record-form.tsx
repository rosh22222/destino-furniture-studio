"use client";

import { useActionState, useState } from "react";
import { Save, Upload } from "lucide-react";

import { saveAdminRecord, type AdminActionState } from "@/app/admin/actions";
import type { AdminResource, AdminRow } from "@/lib/admin";

const initialState: AdminActionState = {
  ok: false,
  message: "",
};

export function AdminRecordForm({
  resource,
  record,
}: {
  resource: AdminResource;
  record?: AdminRow;
}) {
  const [state, action, pending] = useActionState(saveAdminRecord, initialState);
  const [preview, setPreview] = useState<string | null>(record?.imageUrl || null);

  return (
    <form
      action={action}
      className="rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-5"
    >
      <input name="resource" type="hidden" value={resource.slug} />
      {record ? <input name="id" type="hidden" value={record.id} /> : null}
      <input name="existingImageUrl" type="hidden" value={record?.imageUrl || ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Title
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            defaultValue={record?.title}
            name="title"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Slug
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            defaultValue={record?.slug}
            name="slug"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Status
          <select
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            defaultValue={record?.status || "draft"}
            name="status"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D]">
          Display order
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            defaultValue={record?.displayOrder || 100}
            name="displayOrder"
            type="number"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-[#29282D] md:col-span-2">
          Image alt text
          <input
            className="h-12 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 text-base"
            defaultValue={record?.imageAlt}
            name="imageAlt"
          />
        </label>
        <div className="space-y-3 md:col-span-2">
          <label className="block space-y-2 text-sm font-medium text-[#29282D]">
            Image upload
            <span className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-[#DED7CF] bg-white p-4">
              {preview ? (
                <span className="block aspect-[16/9] w-full overflow-hidden rounded-[4px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Admin image preview"
                    className="h-full w-full object-contain"
                    src={preview}
                  />
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm text-[#625f5a]">
                  <Upload aria-hidden="true" className="h-4 w-4" />
                  Upload image
                </span>
              )}
            </span>
            <input
              accept="image/*"
              className="block w-full text-sm text-[#625f5a]"
              name="image"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
              type="file"
            />
          </label>
          {record?.imageUrl ? (
            <label className="flex items-center gap-2 text-sm text-[#625f5a]">
              <input className="h-4 w-4" name="deleteImage" type="checkbox" />
              Remove current image
            </label>
          ) : null}
        </div>
        <label className="space-y-2 text-sm font-medium text-[#29282D] md:col-span-2">
          JSON content
          <textarea
            className="min-h-72 w-full rounded-[4px] border border-[#DED7CF] bg-white px-3 py-3 font-mono text-sm leading-6"
            defaultValue={JSON.stringify(record?.content || {}, null, 2)}
            name="content"
          />
        </label>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-[#202238] px-5 text-sm font-semibold text-white hover:bg-[#C56545] disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          <Save aria-hidden="true" className="h-4 w-4" />
          {pending ? "Saving..." : "Save record"}
        </button>
        {state.message ? (
          <p
            className={state.ok ? "text-sm text-[#355b3d]" : "text-sm text-[#9d3f28]"}
            role="status"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
