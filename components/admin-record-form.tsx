"use client";

import type { ReactElement, ReactNode } from "react";
import { cloneElement, startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Link2, Save, Sparkles, Upload, X } from "lucide-react";

import { saveAdminRecord, type AdminActionState } from "@/app/admin/actions";
import type { AdminResource, AdminRow } from "@/lib/admin";
import { imageAccept, isVideoMedia, maxUploadBytes, mediaAccept, normalizeMediaUrl, validateImageFile, validateMediaFile } from "@/lib/admin-media";

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
  { label: "Visitor Chairs", value: "visitor-chairs" },
  { label: "Office Tables", value: "office-tables" },
  { label: "Cafeteria Chairs", value: "cafeteria-chairs" },
  { label: "Barstools", value: "barstools" },
  { label: "Workstation Tables", value: "workstation-tables-and-chairs" },
  { label: "Workstation Chairs", value: "workstation-chairs" },
  { label: "Lounge Seating", value: "lounge-seating" },
  { label: "Multiseaters", value: "multiseaters" },
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
  const imageUrl = normalizeMediaUrl(record?.imageUrl || contentValue(record, "image") || contentValue(record, "coverImage"));

  if (!value || !imageUrl) {
    return value;
  }

  return value
    .split("\n")
    .map(normalizeMediaUrl)
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
  "h-12 w-full rounded-lg border border-[#D9D2C8] bg-white px-4 text-base font-medium tracking-normal text-[#1E3A8A] outline-none transition placeholder:text-[#8A9AAA] focus:border-[#026670] focus:ring-4 focus:ring-[#026670]/10";
const textareaClass =
  "min-h-28 w-full rounded-lg border border-[#D9D2C8] bg-white px-4 py-3 text-base font-medium leading-7 tracking-normal text-[#1E3A8A] outline-none transition placeholder:text-[#8A9AAA] focus:border-[#026670] focus:ring-4 focus:ring-[#026670]/10";
const labelClass = "space-y-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#026670]";

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
    <section className="border-b border-[#E6DDD1] pb-6 last:border-b-0">
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
  required = false,
  wide = false,
}: {
  label: string;
  children: ReactElement<{ id?: string }>;
  required?: boolean;
  wide?: boolean;
}) {
  const fieldId = useId();
  return (
    <div className={`${labelClass} ${wide ? "md:col-span-2" : ""}`}>
      <label className="block" htmlFor={fieldId}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-[#C56545]">*</span>
            <span className="sr-only"> required</span>
          </>
        ) : null}
      </label>
      {cloneElement(children, { id: fieldId })}
    </div>
  );
}

export function AdminRecordForm({
  resource,
  record,
}: {
  resource: AdminResource;
  record?: AdminRow;
}) {
  const [state, action, pending] = useActionState(async (previous: AdminActionState, data: FormData) => {
    const result = await saveAdminRecord(previous, data);
    return { ...previous, ...result };
  }, initialState);
  const [validation, setValidation] = useState("");
  const savedRecord = record && state.record ? state.record : record;
  return (
    <form
      action={action}
      aria-busy={pending}
      className="space-y-5 py-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (pending) return;
        const data = new FormData(event.currentTarget);
        const resourceSlug = String(data.get("resource") || "");
        const validator = resourceSlug === "products" ? validateMediaFile : validateImageFile;
        const files = [...data.getAll("image"), ...data.getAll("galleryImages")]
          .filter((value): value is File => value instanceof File && value.size > 0);
        const error = files.map(validator).find(Boolean) ||
          (files.reduce((total, file) => total + file.size, 0) > maxUploadBytes ? "Upload up to 25 MB at a time." : "");
        setValidation(error);
        if (!error) startTransition(() => action(data));
      }}
    >
      <fieldset className="min-w-0 space-y-5" disabled={pending}>
        <AdminRecordFields key={state.savedAt ?? "initial"} record={savedRecord} resource={resource} />
      </fieldset>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[#E6DDD1] bg-white p-3">
        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#026670] px-7 text-sm font-bold text-white transition hover:bg-[#1E3A8A] disabled:opacity-60"
          disabled={pending} type="submit"
        >
          {state.ok ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : <Save aria-hidden="true" className="h-4 w-4" />}
          {pending ? "Saving..." : "Save Record"}
        </button>
        {validation || state.message ? (
          <p className={`text-sm font-semibold ${!validation && state.ok ? "text-[#026670]" : "text-[#9d3f28]"}`} role="status">
            {pending ? "Saving changes..." : validation || state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function useFilePreviews(files: File[]) {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const next = files.map((file) => URL.createObjectURL(file));
    // Object URLs live only as long as the selected files.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrls(next);
    return () => next.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);
  return urls;
}

function AdminRecordFields({ resource, record }: { resource: AdminResource; record?: AdminRow }) {
  const [originalVersion] = useState(record?.updatedAt || "");
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [coverSource, setCoverSource] = useState<"upload" | "url">("upload");
  const [coverImageUrl, setCoverImageUrl] = useState(record?.imageUrl || "");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [removeCover, setRemoveCover] = useState(false);
  const [galleryUrls, setGalleryUrls] = useState(galleryValue(record));
  const coverPreviews = useFilePreviews(coverFiles);
  const galleryPreviews = useFilePreviews(galleryFiles);
  const visiblePreview = coverSource === "url"
    ? normalizeMediaUrl(coverImageUrl) || null
    : coverPreviews[0] || (!removeCover ? record?.imageUrl : null);
  const visiblePreviewIsVideo = (coverSource === "upload" && coverFiles[0]?.type.startsWith("video/")) ||
    (visiblePreview ? isVideoMedia(visiblePreview) : false);
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const uploadId = useId();
  const [slugEdited, setSlugEdited] = useState(false);
  const isClient = resource.slug === "clients";
  const isProduct = resource.slug === "products";
  const isProject = resource.slug === "projects";
  const supportsCoverLink = isProduct || isProject;
  const acceptedCoverMedia = isProduct ? mediaAccept : imageAccept;
  const acceptedGalleryMedia = isProduct ? mediaAccept : imageAccept;

  function updateGalleryFiles(files: File[]) {
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    if (galleryInputRef.current) galleryInputRef.current.files = transfer.files;
    setGalleryFiles(files);
  }

  function changeCoverSource(source: "upload" | "url") {
    setCoverSource(source);
    setCoverFiles([]);
    setRemoveCover(false);
    if (coverInputRef.current) coverInputRef.current.value = "";
  }

  function syncSlugFromTitle() {
    if ((!isProject && !isProduct) || slugEdited) {
      return;
    }

    const generatedSlug = slugifyValue(titleRef.current?.value || "");

    if (generatedSlug && slugRef.current) {
      slugRef.current.value = generatedSlug;
    }
  }

  return (
    <>
      <input name="resource" type="hidden" value={resource.slug} />
      {record && !record.isSeed ? <input name="id" type="hidden" value={record.id} /> : null}
      <input name="seedSlug" type="hidden" value={record?.isSeed ? record.slug : ""} />
      <input name="expectedUpdatedAt" type="hidden" value={!record?.isSeed ? originalVersion : ""} />
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
            <Field label={isProduct ? "Product name" : "Project title"} required>
              <input
                className={inputClass}
                defaultValue={record?.title}
                name="title"
                onBlur={syncSlugFromTitle}
                onChange={syncSlugFromTitle}
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
                onChange={() => setSlugEdited(true)}
                placeholder="auto-created if empty"
                ref={slugRef}
              />
            </Field>
            <Field label="Status" required>
              <select
                className={inputClass}
                defaultValue={record?.status || "published"}
                name="status"
                required
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
            <input name="displayOrder" type="hidden" value={record?.displayOrder || ""} />

            {isProduct ? (
              <>
                <Field label="Category" required>
                  <select
                    className={inputClass}
                    defaultValue={contentValue(record, "categorySlug")}
                    name="categorySlug"
                    required
                  >
                    <option disabled value="">
                      Select category
                    </option>
                    {contentValue(record, "categorySlug") && !categoryOptions.some((category) => category.value === contentValue(record, "categorySlug")) ? (
                      <option value={contentValue(record, "categorySlug")}>{contentValue(record, "categorySlug")}</option>
                    ) : null}
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Furniture type" required>
                  <select
                    className={inputClass}
                    defaultValue={contentValue(record, "furnitureType") || ""}
                    name="furnitureType"
                    required
                  >
                    <option disabled value="">
                      Select type
                    </option>
                    {contentValue(record, "furnitureType") && !productTypes.includes(contentValue(record, "furnitureType")) ? (
                      <option value={contentValue(record, "furnitureType")}>{contentValue(record, "furnitureType")}</option>
                    ) : null}
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
          {supportsCoverLink ? (
            <>
              <input name="coverSource" type="hidden" value={coverSource} />
              <div aria-label="Cover media source" className="inline-flex max-w-full gap-1 rounded-lg border border-[#D9D2C8] bg-white p-1" role="group">
                {(["upload", "url"] as const).map((source) => (
                  <button
                    aria-pressed={coverSource === source}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition ${coverSource === source ? "bg-[#026670] text-white" : "text-[#1E3A8A] hover:bg-[#EAF6F5]"}`}
                    key={source} onClick={() => changeCoverSource(source)} type="button"
                  >
                    {source === "upload" ? <Upload aria-hidden="true" className="h-4 w-4" /> : <Link2 aria-hidden="true" className="h-4 w-4" />}
                    {source === "upload" ? (isProduct ? "Upload media" : "Upload image") : (isProduct ? "Media link" : "Image link")}
                  </button>
                ))}
              </div>
              {coverSource === "url" ? (
                <Field label={isProduct ? "Product media link" : "Cover image link"} required>
                  <input
                    className={inputClass} name="coverImageUrl" inputMode="url"
                    onChange={(event) => setCoverImageUrl(event.target.value)}
                    placeholder={isProduct ? "https://example.com/product.mp4 or /images/product.png" : "https://example.com/project.jpg"}
                    required value={coverImageUrl}
                  />
                </Field>
              ) : null}
            </>
          ) : null}
          <label
            className={`group flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-[#D9D2C8] bg-[#FCFBF8] p-5 transition ${coverSource === "upload" ? "cursor-pointer hover:border-[#026670] hover:bg-white" : ""}`}
            htmlFor={coverSource === "upload" ? uploadId : undefined}
          >
            {visiblePreview ? (
              <span className="block aspect-[16/9] w-full overflow-hidden rounded-xl bg-white">
                {visiblePreviewIsVideo ? (
                  <video
                    aria-label="Admin video preview"
                    className="h-full w-full object-contain"
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    src={visiblePreview}
                  />
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Admin image preview"
                      className="h-full w-full object-contain"
                      src={visiblePreview}
                    />
                  </>
                )}
              </span>
            ) : (
              <span className="flex flex-col items-center gap-3 text-center text-[#1E3A8A]">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF6F5] text-[#026670] transition group-hover:bg-[#026670] group-hover:text-white">
                  {coverSource === "url" ? <Link2 aria-hidden="true" className="h-6 w-6" /> : <Upload aria-hidden="true" className="h-6 w-6" />}
                </span>
                <span className="text-base font-extrabold">
                  {coverSource === "url" ? "Media preview" : isClient ? "Upload client logo" : isProduct ? "Upload main image or video" : "Upload main image"}
                </span>
                <span className="text-sm font-semibold text-[#61758A]">
                  {isProduct ? "JPG, PNG, WebP, AVIF, MP4, WebM or OGG up to 25 MB" : "JPG, PNG, WebP or AVIF up to 5 MB"}
                </span>
              </span>
            )}
          </label>
          <input
            id={uploadId}
            disabled={coverSource === "url"}
            ref={coverInputRef}
            accept={acceptedCoverMedia}
            className="sr-only"
            name="image"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setCoverFiles(file ? [file] : []);
              if (file) setRemoveCover(false);
            }}
            type="file"
          />

          {!isClient ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Image alt text" wide>
                <input className={inputClass} defaultValue={record?.imageAlt} name="imageAlt" />
              </Field>
              {isProduct || isProject ? (
                <Field label="Cover video path" wide>
                  <input
                    className={inputClass}
                    defaultValue={contentValue(record, "coverVideo")}
                    name="coverVideo"
                    placeholder={isProduct ? "/images/products/example/video.mp4 or https://example.com/video.mp4" : "/images/projects/example/video.mp4"}
                  />
                </Field>
              ) : null}
              <Field label={isProduct ? "Gallery media URLs" : "Gallery image URLs"} wide>
                <textarea
                  className={textareaClass}
                  value={galleryUrls}
                  onChange={(event) => setGalleryUrls(event.target.value)}
                  name="galleryUrls"
                  placeholder={isProduct ? "Extra gallery images or videos after the cover. One URL or /images/... path per line" : "Extra gallery images after the cover. One image URL or /images/... path per line"}
                />
              </Field>
              <Field label={isProduct ? "Upload gallery media" : "Upload gallery images"} wide>
                <input
                  accept={acceptedGalleryMedia}
                  className={`${inputClass} h-auto py-3 file:mr-4 file:rounded-full file:border-0 file:bg-[#EAF6F5] file:px-4 file:py-2 file:text-sm file:font-extrabold file:text-[#026670] hover:file:bg-[#DDF0EF]`}
                  multiple
                  name="galleryImages"
                  ref={galleryInputRef}
                  onChange={(event) => {
                    const selected = Array.from(event.target.files || []);
                    const combined = [...galleryFiles, ...selected];
                    updateGalleryFiles(combined.filter((file, index) => combined.findIndex((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified) === index));
                  }}
                  type="file"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:col-span-2">
                {Array.from(new Set(galleryUrls.split(/\r?\n/).map(normalizeMediaUrl).filter(Boolean))).map((url) => (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#D9D2C8] bg-white" key={url}>
                    {isVideoMedia(url) ? (
                      <video aria-label="Gallery video preview" className="h-full w-full object-contain" muted playsInline preload="metadata" src={url} />
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="Gallery preview" className="h-full w-full object-contain" src={url} />
                      </>
                    )}
                    <button
                      aria-label="Remove gallery image" title="Remove gallery image"
                      className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#9d3f28] shadow"
                      onClick={() => setGalleryUrls(galleryUrls.split(/\r?\n/).filter((line) => normalizeMediaUrl(line) !== url).join("\n"))}
                      type="button"
                    ><X aria-hidden="true" className="h-4 w-4" /></button>
                  </div>
                ))}
                {galleryPreviews.map((url, index) => (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#026670] bg-white" key={url}>
                    {galleryFiles[index]?.type.startsWith("video/") ? (
                      <video aria-label={`New gallery video ${index + 1}`} className="h-full w-full object-contain" muted playsInline preload="metadata" src={url} />
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt={`New gallery image ${index + 1}`} className="h-full w-full object-contain" src={url} />
                      </>
                    )}
                    <button
                      aria-label={`Remove selected image ${index + 1}: ${galleryFiles[index]?.name || ""}`} title="Remove selected image"
                      className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#9d3f28] shadow"
                      onClick={() => updateGalleryFiles(galleryFiles.filter((_, fileIndex) => fileIndex !== index))}
                      type="button"
                    ><X aria-hidden="true" className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {record?.imageUrl && !isClient && coverSource === "upload" ? (
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1E3A8A]">
              <input checked={removeCover} onChange={(event) => setRemoveCover(event.target.checked)} disabled={coverFiles.length > 0} className="h-4 w-4 accent-[#026670]" name="deleteImage" type="checkbox" />
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


      {isClient && !visiblePreview ? (
        <div className="flex items-center gap-2 rounded-full bg-[#EAF6F5] px-4 py-2 text-sm font-bold text-[#1E3A8A]">
          <ImagePlus aria-hidden="true" className="h-4 w-4 text-[#026670]" />
          Logo name is created from the uploaded file name.
        </div>
      ) : null}
    </>
  );
}
