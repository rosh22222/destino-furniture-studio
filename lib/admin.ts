import "server-only";

import { redirect } from "next/navigation";

import { products as seedProducts, projects as seedProjects } from "@/lib/data";
import { createCookieSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export type AdminResourceKind = "content" | "lead";

export type AdminResource = {
  slug: string;
  label: string;
  table: string;
  kind: AdminResourceKind;
  description: string;
};

export type AdminRow = {
  id: string;
  title: string;
  slug?: string;
  status: string;
  displayOrder?: number;
  imageUrl?: string;
  imageAlt?: string;
  content?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  phone?: string;
  email?: string;
  sourcePath?: string;
  products?: string[];
  message?: string;
  isSeed?: boolean;
};

export const adminResources: AdminResource[] = [
  {
    slug: "products",
    label: "Products",
    table: "products",
    kind: "content",
    description: "Add products with category, furniture type, image and product details.",
  },
  {
    slug: "projects",
    label: "Projects",
    table: "projects",
    kind: "content",
    description: "Add project case studies with client, location, sector, images and scope.",
  },
  {
    slug: "clients",
    label: "Clients",
    table: "clients",
    kind: "content",
    description: "Upload client logos for the clients page.",
  },
];

export function getAdminResource(slug: string) {
  return adminResources.find((resource) => resource.slug === slug);
}

export function isAdminRole(role?: string | null) {
  return role === "admin" || role === "editor";
}

export async function getAdminContext() {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      user: null,
      role: null,
    };
  }

  const supabase = await createCookieSupabaseClient();
  const { data: userData } = await supabase!.auth.getUser();
  const user = userData.user;

  if (!user) {
    return {
      configured: true,
      user: null,
      role: null,
    };
  }

  const { data: profile } = await supabase!
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    configured: true,
    user,
    role: (profile?.role as string | null) || null,
  };
}

export async function requireAdmin() {
  const context = await getAdminContext();

  if (!context.configured) {
    return context;
  }

  if (!context.user) {
    redirect("/admin/login");
  }

  if (!isAdminRole(context.role)) {
    return context;
  }

  return context;
}

export async function getAdminRows(resource: AdminResource): Promise<AdminRow[]> {
  const supabase = await createCookieSupabaseClient();

  if (!supabase) {
    return [];
  }

  if (resource.kind === "lead") {
    const { data } = await supabase
      .from(resource.table)
      .select("id,name,phone,email,message,source_path,products,status,created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    return (data || []).map((row) => ({
      id: row.id,
      title: row.name,
      name: row.name,
      phone: row.phone,
      email: row.email || "",
      message: row.message,
      sourcePath: row.source_path,
      products: row.products || [],
      status: row.status,
      createdAt: row.created_at,
    }));
  }

  const { data } = await supabase
    .from(resource.table)
    .select(
      "id,title,slug,status,display_order,image_url,image_alt,content,created_at,updated_at",
    )
    .order("display_order", { ascending: true })
    .limit(100);

  const rows = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status,
    displayOrder: row.display_order,
    imageUrl: row.image_url || "",
    imageAlt: row.image_alt || "",
    content: row.content || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  if (resource.slug !== "products" && resource.slug !== "projects") {
    return rows;
  }

  const dbRowsBySlug = new Map(rows.map((row) => [row.slug, row]));

  if (resource.slug === "projects") {
    const seedSlugs = new Set(seedProjects.map((project) => project.slug));
    const seedRows = seedProjects.map<AdminRow>((project) => {
      const dbRow = dbRowsBySlug.get(project.slug);

      if (dbRow) {
        return dbRow;
      }

      return {
        id: `seed:${project.slug}`,
        title: project.title,
        slug: project.slug,
        status: "published",
        displayOrder: project.displayOrder,
        imageUrl: project.coverImage || "",
        imageAlt: project.title,
        content: {
          ...project,
          coverImage: project.coverImage || "",
          coverVideo: project.coverVideo || "",
          gallery: project.gallery,
          clientName: project.clientName,
          sector: project.sector,
          location: project.location,
          description: project.description,
          scope: project.scope,
          categories: project.categories,
          relatedProductSlugs: project.relatedProductSlugs,
        },
        updatedAt: project.updatedAt,
        isSeed: true,
      };
    });
    const databaseOnlyRows = rows.filter((row) => !seedSlugs.has(row.slug || ""));

    return [...seedRows, ...databaseOnlyRows].sort(
      (a, b) => (a.displayOrder || 100) - (b.displayOrder || 100),
    );
  }

  const publishedSeedProducts = seedProducts.filter(
    (product) => product.status === "published",
  );
  const seedSlugs = new Set(publishedSeedProducts.map((product) => product.slug));
  const seedRows = publishedSeedProducts
    .map<AdminRow>((product) => {
      const dbRow = dbRowsBySlug.get(product.slug);

      if (dbRow) {
        return dbRow;
      }

      return {
        id: `seed:${product.slug}`,
        title: product.name,
        slug: product.slug,
        status: product.status,
        displayOrder: product.displayOrder,
        imageUrl: product.image,
        imageAlt: product.name,
        content: {
          ...product,
          image: product.image,
          gallery: product.gallery,
          categorySlug: product.categorySlug,
          furnitureType: product.furnitureType,
        },
        updatedAt: product.updatedAt,
        isSeed: true,
      };
    });

  const databaseOnlyRows = rows.filter((row) => !seedSlugs.has(row.slug || ""));

  return [...seedRows, ...databaseOnlyRows].sort(
    (a, b) => (a.displayOrder || 100) - (b.displayOrder || 100),
  );
}
