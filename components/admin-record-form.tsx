"use client";

import type { ReactNode } from "react";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Save, Sparkles, Upload } from "lucide-react";

import { saveAdminRecord, type AdminActionState } from "@/app/admin/actions";
import type { AdminResource, AdminRow } from "@/lib/admin";

const initialState: AdminActionState = {
  ok: false,
  message: "",
};

const productTypes = [
  "Chairs",
  "Tables",
  "Storage",
  "Metal Series",
  "Recliners",
  "Swings",
  "Sofas",
  "Customized",
];

const categoryOptions = [
  { label: "Office Turnkey Interiors", value: "office-interiors" },
  { label: "Office Furniture", value: "office-furniture" },
  { label: "Ergonomic Chairs", value: "ergonomic-chairs" },
  { label: "Office Chairs", value: "office-chairs" },
  { label: "Office Tables", value: "office-tables" },
  { label: "Cafeteria Chairs", value: "cafeteria-chairs" },
  { label: "Workstation Tables", value: "workstation-tables-and-chairs" },
  { label: "Workstation Chairs", value: "workstation-chairs" },
  { label: "Wood Collection", value: "customized-furniture" },
  { label: "Storage Units", value: "storage-units" },
  { label: "Metal Series", value: "metal-series" },
  { label: "Banquet Chairs", value: "banquet-chairs" },
  { label: "Cafeteria Tables", value: "cafeteria-tables" },
  { label: "Cafeteria Furniture", value: "cafeteria-furniture" },
  { label: "Restaurant Furniture", value: "restaurant-furniture" },
  { label: "Institutional Furniture", value: "institutional-furniture" },
  { label: "Domestic Furniture", value: "domestic-furniture" },
];

function contentValue(record: AdminRow | undefined, key: string) {
  const value = record?.content?.[key];

  if (Array.isArray(value)) {
    return value.join("\n");
  }

  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    ? String(value)
    : "";
}

function galleryValue(record: AdminRow | undefined) {
  const value = contentValue(record, "gallery");
  const imageUrl = record?.imageUrl || contentValue(record, "image");

  if (!value || !imageUrl) {
    return value;
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line !== imageUrl)
    .join("\n");
}

function slugifyValue(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClass =
  "h-12 w-full rounded-lg border border-[#D9D2C8] bg-white px-4 text-base font-medium text-[#1E3A8A] shadow-[0_8px_20px_rgba(32,34,56,0.03)] outline-none transition placeholder:text-[#8A9AAA] focus:border-[#026670] focus:ring-4 focus:ring-[#026670]/10";
const textareaClass =
  "min-h-28 w-full rounded-lg border border-[#D9D2C8] bg-white px-4 py-3 text-base font-medium leading-7 text-[#1E3A8A] shadow-[0_8px_20px_rgba(32,34,56,0.03)] outline-none transition placeholder:text-[#8A9AAA] focus:border-[#026670] focus:ring-4 focus:ring-[#026670]/10";
const labelClass = "space-y-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#026670]";

type PreviewState = {
  url: string;
  resetKey: string;
};

function FormSection({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E6DDD1] bg-white/90 p-5 shadow-[0_18px_45px_rgba(32,34,56,0.06)]">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF6F5] text-[#026670]">
          <Sparkles aria-hidden="true" className="h-4 w-4" />
        </span>
        <div>
          {eyebrow ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C56545]">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="text-xl font-extrabold text-[#1E3A8A]">{title}</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`${labelClass} ${wide ? "md:col-span-2" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function AdminRecordForm({
  resource,
  record,
}: {
  resource: AdminResource;
  record?: AdminRow;
}) {
  const [state, action, pending] = useActionState(saveAdminRecord, initialState);
  const [preview, setPreview] = useState<PreviewState | null>(
    record?.imageUrl ? { url: record.imageUrl, resetKey: "" } : null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const uploadId = useId();
  const isClient = resource.slug === "clients";
  const isProduct = resource.slug === "products";
  const isProject = resource.slug === "projects";
  const resetKey = !record && state.ok ? String(state.savedAt || state.message) : "";
  const visiblePreview = record
    ? preview?.url || null
    : preview?.resetKey === resetKey
      ? preview.url
      : null;

  useEffect(() => {
    if (state.ok && !record) {
      formRef.current?.reset();
    }
  }, [record, state.ok, state.savedAt]);

  function syncSlugFromTitle() {
    if ((!isProject && !isProduct) || slugRef.current?.value.trim()) {
      return;
    }

    const generatedSlug = slugifyValue(titleRef.current?.value || "");

    if (generatedSlug && slugRef.current) {
      slugRef.current.value = generatedSlug;
    }
  }

  return (
    <form
      action={action}
      className="space-y-5 rounded-2xl border border-[#E6DDD1] bg-[#FFF9F5] p-4 shadow-[0_24px_60px_rgba(32,34,56,0.08)] sm:p-5"
      ref={formRef}
    >
      <input name="resource" type="hidden" value={resource.slug} />
      {record && !record.isSeed ? <input name="id" type="hidden" value={record.id} /> : null}
      <input name="existingImageUrl" type="hidden" value={record?.imageUrl || ""} />
      <input name="existingTitle" type="hidden" value={record?.title || ""} />
      {isProduct ? (
        <>
          <input name="materials" type="hidden" value={contentValue(record, "materials")} />
          <input name="finishes" type="hidden" value={contentValue(record, "finishes")} />
          <input name="relatedSlugs" type="hidden" value={contentValue(record, "relatedSlugs")} />
          <input name="dimensions" type="hidden" value={contentValue(record, "dimensions")} />
          <input name="brochureUrl" type="hidden" value={contentValue(record, "brochureUrl")} />
        </>
      ) : null}

      {!isClient ? (
        <FormSection eyebrow="CMS" title={isProduct ? "Product Details" : "Project Details"}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={isProduct ? "Product name" : "Project title"}>
              <input
                className={inputClass}
                defaultValue={record?.title}
                name="title"
                onBlur={syncSlugFromTitle}
                onKeyDown={(event) => {
                  if ((isProject || isProduct) && event.key === "Enter") {
                    event.preventDefault();
                    syncSlugFromTitle();
                    slugRef.current?.focus();
                  }
                }}
                ref={titleRef}
                required
              />
            </Field>
            <Field label="Page slug">
              <input
                className={inputClass}
                defaultValue={record?.slug}
                name="slug"
                placeholder="auto-created if empty"
                ref={slugRef}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                defaultValue={record?.status || "published"}
                name="status"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
            <input name="displayOrder" type="hidden" value={record?.displayOrder || ""} />

            {isProduct ? (
              <>
                <Field label="Category">
                  <select
                    className={inputClass}
                    defaultValue={contentValue(record, "categorySlug")}
                    name="categorySlug"
                    required
                  >
                    <option disabled value="">
                      Select category
                    </option>
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Furniture type">
                  <select
                    className={inputClass}
                    defaultValue={contentValue(record, "furnitureType") || ""}
                    name="furnitureType"
                    required
                  >
                    <option disabled value="">
                      Select type
                    </option>
                    {productTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Product ID">
                  <input className={inputClass} defaultValue={contentValue(record, "sku")} name="sku" />
                </Field>
              </>
            ) : null}

            {isProject ? (
              <>
                <Field label="Client name">
                  <input
                    className={inputClass}
                    defaultValue={contentValue(record, "clientName")}
                    name="clientName"
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputClass}
                    defaultValue={contentValue(record, "location")}
                    name="location"
                    placeholder="Vizag"
                  />
                </Field>
                <Field label="Sector">
                  <input
                    className={inputClass}
                    defaultValue={contentValue(record, "sector")}
                    name="sector"
                    placeholder="Corporate"
                  />
                </Field>
                <Field label="Cover video path">
                  <input
                    className={inputClass}
                    defaultValue={contentValue(record, "coverVideo")}
                    name="coverVideo"
                    placeholder="/images/projects/example/video.mp4"
                  />
                </Field>
              </>
            ) : null}
          </div>
        </FormSection>
      ) : (
        <input name="displayOrder" type="hidden" value={record?.displayOrder || 100} />
      )}

      <FormSection
        eyebrow={isClient ? "Logo" : "Media"}
        title={isClient ? "Client Logo" : isProduct ? "Product Image" : "Project Cover Image"}
      >
        <div className="space-y-4">
          <label
            className="group flex min-h-52 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#D9D2C8] bg-[#FCFBF8] p-5 transition hover:border-[#026670] hover:bg-white hover:shadow-[0_18px_46px_rgba(2,102,112,0.10)]"
            htmlFor={uploadId}
          >
            {visiblePreview ? (
              <span className="block aspect-[16/9] w-full overflow-hidden rounded-xl bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Admin image preview"
                  className="h-full w-full object-contain"
                  src={visiblePreview}
                />
              </span>
            ) : (
              <span className="flex flex-col items-center gap-3 text-center text-[#1E3A8A]">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF6F5] text-[#026670] transition group-hover:bg-[#026670] group-hover:text-white">
                  <Upload aria-hidden="true" className="h-6 w-6" />
                </span>
                <span className="text-base font-extrabold">
                  {isClient ? "Upload client logo" : "Upload main image"}
                </span>
                <span className="text-sm font-semibold text-[#61758A]">
                  JPG, PNG, WebP or AVIF up to 5 MB
                </span>
              </span>
            )}
          </label>
          <input
            id={uploadId}
            accept="image/*"
            className="sr-only"
            name="image"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setPreview({
                  url: URL.createObjectURL(file),
                  resetKey,
                });
              }
            }}
            type="file"
          />

          {!isClient ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Image alt text" wide>
                <input className={inputClass} defaultValue={record?.imageAlt} name="imageAlt" />
              </Field>
              <Field label="Gallery image URLs" wide>
                <textarea
                  className={textareaClass}
                  defaultValue={galleryValue(record)}
                  name="galleryUrls"
                  placeholder="Extra gallery images after the cover. One image URL or /images/... path per line"
                />
              </Field>
              <Field label="Upload gallery images" wide>
                <input
                  accept="image/*"
                  className={`${inputClass} h-auto py-3 file:mr-4 file:rounded-full file:border-0 file:bg-[#EAF6F5] file:px-4 file:py-2 file:text-sm file:font-extrabold file:text-[#026670] hover:file:bg-[#DDF0EF]`}
                  multiple
                  name="galleryImages"
                  type="file"
                />
              </Field>
            </div>
          ) : null}

          {record?.imageUrl && !isClient ? (
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1E3A8A]">
              <input className="h-4 w-4 accent-[#026670]" name="deleteImage" type="checkbox" />
              Remove current image
            </label>
          ) : null}
        </div>
      </FormSection>

      {isProduct ? (
        <FormSection eyebrow="Content" title="Product Copy">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Description" wide>
              <textarea
                className={textareaClass}
                defaultValue={
                  contentValue(record, "fullDescription") ||
                  contentValue(record, "shortDescription")
                }
                name="fullDescription"
                placeholder={"Use **bold**, *italic*, and a blank line for a new paragraph."}
              />
            </Field>
            <Field label="Features">
              <textarea
                className={textareaClass}
                defaultValue={contentValue(record, "features")}
                name="features"
                placeholder="One feature per line"
              />
            </Field>
          </div>
        </FormSection>
      ) : null}

      {isProject ? (
        <FormSection eyebrow="Content" title="Project Story">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project description" wide>
              <textarea
                className={textareaClass}
                defaultValue={contentValue(record, "description")}
                name="description"
                placeholder={"Use **bold**, *italic*, ***bold italic***, and a blank line for a new paragraph."}
              />
            </Field>
            <Field label="Scope of work">
              <textarea
                className={textareaClass}
                defaultValue={contentValue(record, "scope")}
                name="scope"
                placeholder="One scope item per line"
              />
            </Field>
            <Field label="Categories">
              <textarea
                className={textareaClass}
                defaultValue={contentValue(record, "categories")}
                name="categories"
                placeholder="One category slug per line"
              />
            </Field>
          </div>
        </FormSection>
      ) : null}

      {isProduct && contentValue(record, "featured") === "true" ? (
        <input name="featured" type="hidden" value="on" />
      ) : null}

      <div className="rounded-2xl border border-[#E6DDD1] bg-white p-3 shadow-[0_18px_45px_rgba(32,34,56,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#026670] px-7 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_rgba(2,102,112,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1E3A8A] disabled:opacity-60"
            disabled={pending}
            type="submit"
          >
            {state.ok ? (
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Save aria-hidden="true" className="h-4 w-4" />
            )}
            {pending ? "Saving..." : "Save Record"}
          </button>
          {state.message ? (
            <p
              className={
                state.ok
                  ? "text-sm font-bold text-[#026670]"
                  : "text-sm font-bold text-[#9d3f28]"
              }
              role="status"
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </div>

      {isClient && !visiblePreview ? (
        <div className="flex items-center gap-2 rounded-full bg-[#EAF6F5] px-4 py-2 text-sm font-bold text-[#1E3A8A]">
          <ImagePlus aria-hidden="true" className="h-4 w-4 text-[#026670]" />
          Logo name is created from the uploaded file name.
        </div>
      ) : null}
    </form>
  );
}
