"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminContext, getAdminResource, isAdminRole } from "@/lib/admin";
import { createCookieSupabaseClient } from "@/lib/supabase";
import { cleanText, slugify } from "@/lib/utils";

export type AdminActionState = {
  ok: boolean;
  message: string;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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

  const title = cleanText(formData.get("title"));
  const slug = slugify(cleanText(formData.get("slug")) || title);
  const status = cleanText(formData.get("status")) === "published" ? "published" : "draft";
  const displayOrder = Number.parseInt(cleanText(formData.get("displayOrder")), 10);
  const imageAlt = cleanText(formData.get("imageAlt"));
  const existingImageUrl = cleanText(formData.get("existingImageUrl"));
  const deleteImage = cleanText(formData.get("deleteImage")) === "on";
  const rawJson = String(formData.get("content") || "{}");
  const id = cleanText(formData.get("id"));

  if (!title || !slug) {
    return {
      ok: false,
      message: "Title and slug are required.",
    };
  }

  let content: Record<string, unknown>;

  try {
    content = JSON.parse(rawJson || "{}");
  } catch {
    return {
      ok: false,
      message: "JSON content is not valid.",
    };
  }

  let imageUrl = deleteImage ? null : existingImageUrl || null;
  const image = formData.get("image");

  if (image instanceof File && image.size > 0) {
    if (image.size > 5 * 1024 * 1024) {
      return {
        ok: false,
        message: "Image must be 5 MB or smaller.",
      };
    }

    if (!image.type.startsWith("image/")) {
      return {
        ok: false,
        message: "Upload a valid image file.",
      };
    }

    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${resource.slug}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("website-media")
      .upload(filePath, image, {
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      return {
        ok: false,
        message: uploadError.message,
      };
    }

    const { data } = supabase.storage
      .from("website-media")
      .getPublicUrl(filePath);
    imageUrl = data.publicUrl;
  }

  const payload = {
    title,
    slug,
    status,
    display_order: Number.isFinite(displayOrder) ? displayOrder : 100,
    image_url: imageUrl,
    image_alt: imageAlt || null,
    content,
  };

  const query = id
    ? supabase.from(resource.table).update(payload).eq("id", id)
    : supabase.from(resource.table).insert(payload);

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

  return {
    ok: true,
    message: "Record saved.",
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
