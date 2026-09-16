"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminContext, getAdminResource, getSeedRows, isAdminRole, type AdminRow } from "@/lib/admin";
import { maxUploadBytes, normalizeMediaUrl, validMediaUrl, validateImageFile, validateMediaFile } from "@/lib/admin-media";
import { sourceSlug } from "@/lib/catalogue-records";
import { stripRichText } from "@/lib/rich-text";
import { createCookieSupabaseClient } from "@/lib/supabase";
import { cleanText, slugify } from "@/lib/utils";

export type AdminActionState = {
  ok: boolean;
  message: string;
  savedAt?: number;
  record?: AdminRow;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const accountSchema = z
  .object({
    email: z.union([z.literal(""), z.string().email()]),
    password: z.union([z.literal(""), z.string().min(6)]),
    confirmPassword: z.string(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "New password and confirmation do not match.",
    path: ["confirmPassword"],
  });

async function getAuthorizedSupabase() {
  const context = await getAdminContext();

  if (!context.configured || !context.user || !isAdminRole(context.role)) {
    return null;
  }

  return createCookieSupabaseClient();
}

export async function loginAdmin(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const supabase = await createCookieSupabaseClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase is not configured.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: cleanText(formData.get("email")),
    password: cleanText(formData.get("password")),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Enter a valid admin email and password.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createCookieSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

function cleanMultiline(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[<>]/g, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function cleanFormattedText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[<>]/g, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function lines(value: FormDataEntryValue | null) {
  return cleanMultiline(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function mediaLines(value: FormDataEntryValue | null) {
  return lines(value).map(normalizeMediaUrl);
}

function filenameTitle(file?: File | null) {
  if (!file?.name) {
    return "";
  }

  const name = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
  return name.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function uploadedFiles(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

async function uploadMediaFile(
  supabase: NonNullable<Awaited<ReturnType<typeof getAuthorizedSupabase>>>,
  resourceSlug: string,
  file: File,
  validator: (file: File) => string = validateImageFile,
) {
  const validationMessage = validator(file);

  if (validationMessage) {
    return {
      error: validationMessage,
      url: "",
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${resourceSlug}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("website-media")
    .upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    return {
      error: uploadError.message,
      url: "",
    };
  }

  const { data } = supabase.storage.from("website-media").getPublicUrl(filePath);

  return {
    error: "",
    url: data.publicUrl,
    path: filePath,
  };
}

function buildResourceContent(
  resourceSlug: string,
  formData: FormData,
  imageUrl: string | null,
  title: string,
  uploadedGalleryUrls: string[] = [],
  existing: Record<string, unknown> = {},
) {
  if (resourceSlug === "products") {
    const gallery = [...mediaLines(formData.get("galleryUrls")), ...uploadedGalleryUrls];
    const fullDescription = cleanFormattedText(formData.get("fullDescription"));
    const shortDescription = fullDescription;

    if (imageUrl && !gallery.includes(imageUrl)) {
      gallery.unshift(imageUrl);
    }

    const uniqueGallery = Array.from(new Set(gallery));

    return {
      ...existing,
      categorySlug: cleanText(formData.get("categorySlug")),
      furnitureType: cleanText(formData.get("furnitureType")) || "Furniture",
      image: imageUrl || "",
      gallery: uniqueGallery,
      shortDescription,
      fullDescription,
      coverVideo: normalizeMediaUrl(cleanText(formData.get("coverVideo"))),
      features: lines(formData.get("features")),
      sku: cleanText(formData.get("sku")),
      seoTitle: title,
      seoDescription: stripRichText(fullDescription),
    };
  }

  if (resourceSlug === "projects") {
    const gallery = [...mediaLines(formData.get("galleryUrls")), ...uploadedGalleryUrls];
    const description = cleanFormattedText(formData.get("description"));

    if (imageUrl && !gallery.includes(imageUrl)) {
      gallery.unshift(imageUrl);
    }

    const uniqueGallery = Array.from(new Set(gallery));

    return {
      ...existing,
      clientName: cleanText(formData.get("clientName")),
      sector: cleanText(formData.get("sector")) || "Commercial",
      location: cleanText(formData.get("location")),
      coverImage: imageUrl || "",
      coverVideo: normalizeMediaUrl(cleanText(formData.get("coverVideo"))),
      gallery: uniqueGallery,
      description,
      scope: lines(formData.get("scope")),
      categories: lines(formData.get("categories")),
      seoTitle: title,
      seoDescription: stripRichText(description),
    };
  }

  return {
    sector: "Client",
    logo: imageUrl || "",
  };
}

function refreshCatalogue() {
  // Products also appear in navigation, related items, category pages and the sitemap.
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

function saveError(message: string): AdminActionState {
  return { ok: false, message };
}

export async function saveAdminRecord(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const uploadedPaths: string[] = [];
  let supabase: Awaited<ReturnType<typeof getAuthorizedSupabase>> = null;
  let committed = false;

  try {
    const resource = getAdminResource(cleanText(formData.get("resource")));
    if (!resource || resource.kind !== "content") return saveError("Unknown admin resource.");
    supabase = await getAuthorizedSupabase();
    if (!supabase) return saveError("Your session has expired or you do not have permission. Sign in and try again.");

    const id = cleanText(formData.get("id"));
    const seedSlug = cleanText(formData.get("seedSlug"));
    const seeds = getSeedRows(resource.slug);
    let existing: AdminRow | undefined;
    if (id) {
      const { data, error } = await supabase.from(resource.table).select("*").eq("id", id).maybeSingle();
      if (error) return saveError("Could not load this record. Please try again.");
      if (!data || data.content?._deleted) return saveError("This record was deleted. Refresh the page.");
      const seed = seeds.find((item) => item.slug === sourceSlug(data));
      existing = {
        id: data.id, title: data.title, slug: data.slug, status: data.status,
        displayOrder: data.display_order, imageUrl: data.image_url ?? "",
        imageAlt: data.image_alt ?? "", updatedAt: data.updated_at,
        content: { ...seed?.content, ...data.content },
      };
      const expectedUpdatedAt = cleanText(formData.get("expectedUpdatedAt"));
      if (expectedUpdatedAt && expectedUpdatedAt !== existing.updatedAt) {
        return saveError("This record has changed in another tab. Refresh before saving so newer changes are kept.");
      }
    } else if (seedSlug) {
      existing = seeds.find((item) => item.slug === seedSlug);
      if (!existing) return saveError("This original record is no longer available. Refresh the page.");
      const { data, error } = await supabase.rpc("catalogue_overrides", { resource: resource.slug });
      if (error) return saveError("Could not check this record. Please try again.");
      if ((data as { slug: string }[]).some((row) => row.slug === seedSlug)) {
        return saveError("This record has already been edited. Refresh to load the saved version.");
      }
    }

    const acceptsMixedMedia = resource.slug === "products";
    const validateUpload = acceptsMixedMedia ? validateMediaFile : validateImageFile;
    const useCoverLink = (resource.slug === "projects" || resource.slug === "products") && cleanText(formData.get("coverSource")) === "url";
    const coverImageUrl = normalizeMediaUrl(cleanText(formData.get("coverImageUrl")));
    if (useCoverLink && (!coverImageUrl || !validMediaUrl(coverImageUrl))) {
      return saveError(resource.slug === "products"
        ? "Enter a valid https:// product media link or a local /images/ path."
        : "Enter a valid https:// cover image link or a local /images/ path.");
    }
    const uploadedImage = useCoverLink ? null : uploadedFiles(formData, "image")[0] ?? null;
    const galleryImages = uploadedFiles(formData, "galleryImages");
    const files = [...(uploadedImage ? [uploadedImage] : []), ...galleryImages];
    for (const file of files) {
      const error = validateUpload(file);
      if (error) return saveError(error);
    }
    if (files.reduce((total, file) => total + file.size, 0) > maxUploadBytes) {
      return saveError("Upload up to 25 MB at a time. Save these images, then add the remaining images.");
    }

    const title = resource.slug === "clients"
      ? existing?.title || filenameTitle(uploadedImage)
      : cleanText(formData.get("title"));
    const slug = slugify(cleanText(formData.get("slug")) || title);
    if (!title || !slug) return saveError("Enter a title and a valid page slug.");
    if (resource.slug === "products" && (!cleanText(formData.get("furnitureType")) || !cleanText(formData.get("categorySlug")))) {
      return saveError("Select a category and furniture type.");
    }

    const originalSlug = existing?.isSeed ? existing.slug : existing ? sourceSlug(existing) : "";
    const linkedSeed = seeds.find((item) => item.slug === originalSlug);
    if (seeds.some((item) => item.slug === slug && item.slug !== linkedSeed?.slug)) {
      return saveError("That page slug belongs to an existing record. Choose a different slug.");
    }
    const { data: duplicate, error: duplicateError } = await supabase.from(resource.table)
      .select("id").eq("slug", slug).maybeSingle();
    if (duplicateError) return saveError("Could not check the page slug. Please try again.");
    if (duplicate && duplicate.id !== id) return saveError("That page slug is already in use. Choose a different slug.");

    let imageUrl = cleanText(formData.get("deleteImage")) === "on" ? null : normalizeMediaUrl(existing?.imageUrl || "") || null;
    if (useCoverLink) imageUrl = coverImageUrl;
    const urls = [
      ...mediaLines(formData.get("galleryUrls")),
      normalizeMediaUrl(cleanText(formData.get("coverVideo"))),
    ];
    if (urls.some((url) => !validMediaUrl(url))) return saveError("Use an https:// media URL or a local /images/ path.");
    if (resource.slug === "clients" && !uploadedImage && !imageUrl) return saveError("Upload a client logo.");

    let displayOrder = existing?.displayOrder ?? 100;
    const category = cleanText(formData.get("categorySlug"));
    const categoryChanged = resource.slug === "products" && existing && existing.content?.categorySlug !== category;
    if (!existing || categoryChanged) {
      let query = supabase.from(resource.table).select("display_order")
        .order("display_order", { ascending: false }).limit(1);
      if (resource.slug === "products") query = query.eq("content->>categorySlug", category);
      const { data, error } = await query.maybeSingle();
      if (error) return saveError("Could not determine display order. Please try again.");
      const seedOrders = seeds.filter((item) => resource.slug !== "products" || item.content?.categorySlug === category)
        .map((item) => item.displayOrder ?? 0);
      displayOrder = Math.max(0, ...seedOrders, data?.display_order ?? 0) + 1;
    }

    async function upload(file: File) {
      const result = await uploadMediaFile(supabase!, resource!.slug, file, validateUpload);
      if (result.error) throw new Error(result.error);
      if (result.path) uploadedPaths.push(result.path);
      return result.url;
    }
    if (uploadedImage) imageUrl = await upload(uploadedImage);
    const uploadedGalleryUrls: string[] = [];
    for (const file of galleryImages) uploadedGalleryUrls.push(await upload(file));

    const content: Record<string, unknown> = buildResourceContent(
      resource.slug, formData, imageUrl, title, uploadedGalleryUrls, existing?.content,
    );
    if (linkedSeed) content._seedSlug = linkedSeed.slug;
    delete content._deleted;
    const payload = {
      title, slug,
      status: resource.slug === "clients" || cleanText(formData.get("status")) === "published" ? "published" : "draft",
      display_order: displayOrder,
      image_url: imageUrl,
      image_alt: cleanText(formData.get("imageAlt")) || title,
      content,
    };
    const query = id
      ? supabase.from(resource.table).update(payload).eq("id", id).eq("updated_at", existing!.updatedAt!)
      : supabase.from(resource.table).insert(payload);
    const { data: saved, error } = await query.select("*").maybeSingle();
    if (error || !saved) {
      if (uploadedPaths.length) await supabase.storage.from("website-media").remove(uploadedPaths);
      uploadedPaths.length = 0;
      return saveError(error?.code === "23505"
        ? "This record or page slug was saved elsewhere. Refresh before trying again."
        : error ? `The record could not be saved: ${error.message}`
        : "This record changed or was deleted. Refresh before saving.");
    }

    committed = true;
    refreshCatalogue();
    return {
      ok: true, message: "Record saved.", savedAt: Date.now(),
      record: {
        id: saved.id, title: saved.title, slug: saved.slug, status: saved.status,
        displayOrder: saved.display_order, imageUrl: saved.image_url ?? "",
        imageAlt: saved.image_alt ?? "", content: saved.content,
        createdAt: saved.created_at, updatedAt: saved.updated_at,
      },
    };
  } catch (error) {
    if (!committed && supabase && uploadedPaths.length) {
      await supabase.storage.from("website-media").remove(uploadedPaths).catch(() => {});
    }
    return saveError(committed
      ? "Saved, but the page could not refresh. Reload to see your changes."
      : error instanceof Error ? error.message : "Could not save. Please try again.");
  }
}

export async function updateAdminAccount(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const context = await getAdminContext();

  if (!context.configured || !context.user || !isAdminRole(context.role)) {
    return {
      ok: false,
      message: "You do not have permission to update this account.",
    };
  }

  const parsed = accountSchema.safeParse({
    email: cleanText(formData.get("email")),
    password: cleanText(formData.get("password")),
    confirmPassword: cleanText(formData.get("confirmPassword")),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Enter valid account details.",
    };
  }

  if (!parsed.data.email && !parsed.data.password) {
    return {
      ok: false,
      message: "Enter a new email or new password.",
    };
  }

  const supabase = await createCookieSupabaseClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase is not configured.",
    };
  }

  const updates: { email?: string; password?: string } = {};

  if (parsed.data.email && parsed.data.email !== context.user.email) {
    updates.email = parsed.data.email;
  }

  if (parsed.data.password) {
    updates.password = parsed.data.password;
  }

  if (!updates.email && !updates.password) {
    return {
      ok: false,
      message: "Enter a different email or a new password.",
    };
  }

  const { error } = await supabase.auth.updateUser(updates);

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  if (updates.email) {
    await supabase
      .from("profiles")
      .update({ email: updates.email })
      .eq("id", context.user.id);
  }

  revalidatePath("/admin");

  return {
    ok: true,
    message: updates.email
      ? "Account updated. Confirm the new email if Supabase sends a verification email."
      : "Password updated.",
  };
}

export async function deleteAdminRecord(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const resource = getAdminResource(cleanText(formData.get("resource")));
  const id = cleanText(formData.get("id"));
  const sourceTable = cleanText(formData.get("sourceTable"));
  if (!resource || !id) return saveError("Unknown record.");
  const supabase = await getAuthorizedSupabase();
  if (!supabase) return saveError("Sign in again before deleting this record.");

  const table = resource.kind === "lead" && resource.slug === "enquiries" &&
    ["quotation_requests", "website_enquiries"].includes(sourceTable) ? sourceTable : resource.table;
  try {
    if (resource.slug === "products" || resource.slug === "projects") {
      const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
      if (error || !data) return saveError("Could not load this record. Refresh and try again.");
      const linkedSeed = getSeedRows(resource.slug).find((seed) => seed.slug === sourceSlug(data));
      // Keep a draft tombstone for originals so code content cannot reappear.
      const query = linkedSeed
        ? supabase.from(table).update({ status: "draft", content: {
            ...data.content, _seedSlug: linkedSeed.slug, _deleted: true,
          } }).eq("id", id).eq("updated_at", data.updated_at)
        : supabase.from(table).delete().eq("id", id).eq("updated_at", data.updated_at);
      const result = await query.select("id").maybeSingle();
      if (result.error || !result.data) return saveError("The record changed or could not be deleted. Refresh and try again.");
    } else {
      const { data, error } = await supabase.from(table).delete().eq("id", id).select("id").maybeSingle();
      if (error || !data) return saveError("Could not delete the record. Please try again.");
    }
    refreshCatalogue();
    return { ok: true, message: "Record deleted." };
  } catch {
    return saveError("Could not delete the record. Please try again.");
  }
}

export async function updateLeadStatus(formData: FormData) {
  const resource = getAdminResource(cleanText(formData.get("resource")));
  const id = cleanText(formData.get("id"));
  const status = cleanText(formData.get("status")) || "new";
  const sourceTable = cleanText(formData.get("sourceTable"));

  if (!resource || resource.kind !== "lead" || !id) {
    redirect("/admin");
  }

  const supabase = await getAuthorizedSupabase();

  if (!supabase) {
    redirect("/admin");
  }

  const table =
    resource.slug === "enquiries" &&
    ["quotation_requests", "website_enquiries"].includes(sourceTable)
      ? sourceTable
      : resource.table;

  await supabase.from(table).update({ status }).eq("id", id);
  revalidatePath(`/admin/${resource.slug}`);
  redirect(`/admin/${resource.slug}`);
}
