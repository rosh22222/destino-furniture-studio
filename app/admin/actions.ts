"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminContext, getAdminResource, isAdminRole } from "@/lib/admin";
import { stripRichText } from "@/lib/rich-text";
import { createCookieSupabaseClient } from "@/lib/supabase";
import { cleanText, slugify } from "@/lib/utils";

export type AdminActionState = {
  ok: boolean;
  message: string;
  savedAt?: number;
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

function normalizeMediaUrl(value: string) {
  try {
    const url = new URL(value, "http://localhost");

    if (url.pathname === "/_next/image") {
      return url.searchParams.get("url") || value;
    }
  } catch {
    return value;
  }

  return value;
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

function validateImageFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    return "Image must be 5 MB or smaller.";
  }

  if (!file.type.startsWith("image/")) {
    return "Upload valid image files only.";
  }

  return "";
}

async function uploadImageFile(
  supabase: NonNullable<Awaited<ReturnType<typeof getAuthorizedSupabase>>>,
  resourceSlug: string,
  file: File,
) {
  const validationMessage = validateImageFile(file);

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
  };
}

function buildResourceContent(
  resourceSlug: string,
  formData: FormData,
  imageUrl: string | null,
  title: string,
  uploadedGalleryUrls: string[] = [],
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
      categorySlug: cleanText(formData.get("categorySlug")),
      brandSlug: cleanText(formData.get("brandSlug")),
      furnitureType: cleanText(formData.get("furnitureType")) || "Furniture",
      image: imageUrl || "",
      gallery: uniqueGallery,
      shortDescription,
      fullDescription,
      features: lines(formData.get("features")),
      materials: lines(formData.get("materials")),
      dimensions: cleanText(formData.get("dimensions")),
      finishes: lines(formData.get("finishes")),
      sku: cleanText(formData.get("sku")),
      brochureUrl: cleanText(formData.get("brochureUrl")),
      relatedSlugs: lines(formData.get("relatedSlugs")),
      featured: cleanText(formData.get("featured")) === "on",
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
      clientName: cleanText(formData.get("clientName")),
      sector: cleanText(formData.get("sector")) || "Commercial",
      location: cleanText(formData.get("location")),
      coverImage: imageUrl || "",
      coverVideo: normalizeMediaUrl(cleanText(formData.get("coverVideo"))),
      gallery: uniqueGallery,
      description,
      scope: lines(formData.get("scope")),
      categories: lines(formData.get("categories")),
      relatedProductSlugs: [],
      featured: cleanText(formData.get("featured")) === "on",
      seoTitle: title,
      seoDescription: stripRichText(description),
    };
  }

  return {
    sector: "Client",
    logo: imageUrl || "",
  };
}

export async function saveAdminRecord(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const resource = getAdminResource(cleanText(formData.get("resource")));

  if (!resource || resource.kind !== "content") {
    return {
      ok: false,
      message: "Unknown admin resource.",
    };
  }

  const supabase = await getAuthorizedSupabase();

  if (!supabase) {
    return {
      ok: false,
      message: "You do not have permission to save this record.",
    };
  }

  const image = formData.get("image");
  const uploadedImage = image instanceof File && image.size > 0 ? image : null;
  const galleryImages = uploadedFiles(formData, "galleryImages");
  const existingTitle = cleanText(formData.get("existingTitle"));
  const enteredTitle = cleanText(formData.get("title"));
  const title =
    enteredTitle || existingTitle || filenameTitle(uploadedImage) || "Client Logo";
  const slug = slugify(cleanText(formData.get("slug")) || title);
  const status =
    resource.slug === "clients"
      ? "published"
      : cleanText(formData.get("status")) === "published"
        ? "published"
        : "draft";
  const displayOrder = Number.parseInt(cleanText(formData.get("displayOrder")), 10);
  const imageAlt = cleanText(formData.get("imageAlt")) || title;
  const existingImageUrl = cleanText(formData.get("existingImageUrl"));
  const deleteImage = cleanText(formData.get("deleteImage")) === "on";
  const id = cleanText(formData.get("id"));

  if (!title || !slug) {
    return {
      ok: false,
      message: "Title and slug are required.",
    };
  }

  if (resource.slug === "clients" && !existingImageUrl && !uploadedImage) {
    return {
      ok: false,
      message: "Upload a client logo.",
    };
  }

  if (resource.slug === "products" && !cleanText(formData.get("furnitureType"))) {
    return {
      ok: false,
      message: "Select a furniture type.",
    };
  }

  let imageUrl = deleteImage ? null : existingImageUrl || null;

  if (uploadedImage) {
    const upload = await uploadImageFile(supabase, resource.slug, uploadedImage);

    if (upload.error) {
      return {
        ok: false,
        message: upload.error,
      };
    }

    imageUrl = upload.url;
  }

  const uploadedGalleryUrls: string[] = [];

  for (const galleryImage of galleryImages) {
    const upload = await uploadImageFile(supabase, resource.slug, galleryImage);

    if (upload.error) {
      return {
        ok: false,
        message: upload.error,
      };
    }

    uploadedGalleryUrls.push(upload.url);
  }

  const content = buildResourceContent(
    resource.slug,
    formData,
    imageUrl,
    title,
    uploadedGalleryUrls,
  );
  let resolvedDisplayOrder = Number.isFinite(displayOrder) ? displayOrder : 100;

  if ((resource.slug === "projects" || resource.slug === "products") && !id && !Number.isFinite(displayOrder)) {
    let query = supabase
      .from(resource.table)
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);

    if (resource.slug === "products") {
      const categorySlug = cleanText(formData.get("categorySlug"));

      if (categorySlug) {
        query = query.eq("content->>categorySlug", categorySlug);
      }
    }

    const { data: latestRecord } = await query.maybeSingle();
    const latestOrder = Number(latestRecord?.display_order);
    resolvedDisplayOrder = Number.isFinite(latestOrder) ? latestOrder + 1 : 100;
  }

  const payload = {
    title,
    slug,
    status,
    display_order: resolvedDisplayOrder,
    image_url: imageUrl,
    image_alt: imageAlt || null,
    content,
  };

  const query = id
    ? supabase.from(resource.table).update(payload).eq("id", id)
    : supabase.from(resource.table).upsert(payload, { onConflict: "slug" });

  const { error } = await query;

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/admin/${resource.slug}`);
  revalidatePath("/products");
  revalidatePath(`/product/${slug}`);
  revalidatePath(`/products/${cleanText(formData.get("categorySlug"))}`);
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/clients");

  return {
    ok: true,
    message: "Record saved.",
    savedAt: Date.now(),
  };
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

export async function deleteAdminRecord(formData: FormData) {
  const resource = getAdminResource(cleanText(formData.get("resource")));
  const id = cleanText(formData.get("id"));

  if (!resource || resource.kind !== "content" || !id) {
    redirect("/admin");
  }

  const supabase = await getAuthorizedSupabase();

  if (!supabase) {
    redirect("/admin");
  }

  await supabase.from(resource.table).delete().eq("id", id);
  revalidatePath("/");
  revalidatePath(`/admin/${resource.slug}`);
  redirect(`/admin/${resource.slug}`);
}

export async function updateLeadStatus(formData: FormData) {
  const resource = getAdminResource(cleanText(formData.get("resource")));
  const id = cleanText(formData.get("id"));
  const status = cleanText(formData.get("status")) || "new";

  if (!resource || resource.kind !== "lead" || !id) {
    redirect("/admin");
  }

  const supabase = await getAuthorizedSupabase();

  if (!supabase) {
    redirect("/admin");
  }

  await supabase.from(resource.table).update({ status }).eq("id", id);
  revalidatePath(`/admin/${resource.slug}`);
  redirect(`/admin/${resource.slug}`);
}
