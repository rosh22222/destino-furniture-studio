import "server-only";

import { redirect } from "next/navigation";

import { products as seedProducts, projects as seedProjects } from "@/lib/data";
import { readContentRows } from "@/lib/content-rows";
import { sourceSlug } from "@/lib/catalogue-records";
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
  company?: string;
  location?: string;
  sourcePath?: string;
  products?: string[];
  project?: string;
  message?: string;
  leadType?: string;
  sourceTable?: string;
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
  {
    slug: "enquiries",
    label: "Enquiries",
    table: "quotation_requests",
    kind: "lead",
    description: "View quotation, contact and franchise enquiries submitted from the website.",
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
    const leadSources =
      resource.slug === "enquiries"
        ? [
            { table: "quotation_requests", label: "Quotation" },
            { table: "website_enquiries", label: "General" },
          ]
        : [{ table: resource.table, label: resource.label }];

    const results = await Promise.all(
      leadSources.map(async (source) => {
        const { data } = await supabase
          .from(source.table)
          .select(
            "id,name,phone,email,company,location,message,source_path,products,project,status,metadata,created_at",
          )
          .order("created_at", { ascending: false })
          .limit(100);

        return (data || []).map((row) => ({
          id: row.id,
          title: row.name,
          name: row.name,
          phone: row.phone,
          email: row.email || "",
          company: row.company || "",
          location: row.location || "",
          message: row.message,
          sourcePath: row.source_path,
          products: row.products || [],
          project: row.project || "",
          status: row.status,
          createdAt: row.created_at,
          leadType: source.label,
          sourceTable: source.table,
          content: row.metadata || {},
        }));
      }),
    );

    return results
      .flat()
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
  }

  const data = await readContentRows(supabase, resource.table);

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

  return mergeAdminCatalogueRows(resource.slug, rows);
}

export function getSeedRows(resource: string): AdminRow[] {
  if (resource === "projects") {
    return seedProjects.map((project) => ({
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
      }));
  }
  if (resource !== "products") return [];
  return seedProducts.filter((product) => product.status === "published")
    .map((product) => ({
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
      }));
}

export function mergeAdminCatalogueRows(resource: string, rows: AdminRow[]) {
  const seeds = new Map(getSeedRows(resource).map((row) => [row.slug, row]));
  const merged = new Map(seeds);
  for (const row of rows) merged.delete(sourceSlug(row));
  for (const row of rows) {
    if (row.content?._deleted) continue;
    const seed = seeds.get(sourceSlug(row));
    merged.set(row.slug, { ...row, content: { ...seed?.content, ...row.content } });
  }
  return [...merged.values()].sort((a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100));
}
