import "server-only";

import { redirect } from "next/navigation";

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
};

export const adminResources: AdminResource[] = [
  {
    slug: "product-categories",
    label: "Product Categories",
    table: "product_categories",
    kind: "content",
    description: "Manage category names, images, SEO content and display order.",
  },
  {
    slug: "products",
    label: "Products",
    table: "products",
    kind: "content",
    description: "Manage product ranges, SKU-level content, galleries and status.",
  },
  {
    slug: "brands",
    label: "Brands and Channel Partners",
    table: "brands",
    kind: "content",
    description: "Manage HOF, Spacewood, Paradise Furniture and future brands.",
  },
  {
    slug: "projects",
    label: "Projects",
    table: "projects",
    kind: "content",
    description: "Manage project case studies, galleries, scopes and SEO fields.",
  },
  {
    slug: "clients",
    label: "Clients",
    table: "clients",
    kind: "content",
    description: "Manage client logos, sectors and display order.",
  },
  {
    slug: "locations",
    label: "Locations",
    table: "locations",
    kind: "content",
    description: "Manage city pages, addresses, hours, maps and service areas.",
  },
  {
    slug: "insights",
    label: "Insights",
    table: "insights",
    kind: "content",
    description: "Manage article drafts, published posts and SEO fields.",
  },
  {
    slug: "faqs",
    label: "FAQs",
    table: "faqs",
    kind: "content",
    description: "Manage visible FAQ questions and answers.",
  },
  {
    slug: "homepage",
    label: "Homepage Featured Content",
    table: "homepage_sections",
    kind: "content",
    description: "Manage homepage featured sections and display order.",
  },
  {
    slug: "contact-info",
    label: "Contact Information",
    table: "site_settings",
    kind: "content",
    description: "Manage phone, WhatsApp, email and confirmed NAP information.",
  },
  {
    slug: "social-links",
    label: "Social Links",
    table: "social_links",
    kind: "content",
    description: "Manage verified social URLs and display status.",
  },
  {
    slug: "footer",
    label: "Footer Content",
    table: "footer_content",
    kind: "content",
    description: "Manage footer navigation, policies and supporting text.",
  },
  {
    slug: "default-seo",
    label: "Default SEO Settings",
    table: "seo_defaults",
    kind: "content",
    description: "Manage global SEO titles, descriptions and indexing defaults.",
  },
  {
    slug: "page-seo",
    label: "Page SEO Settings",
    table: "seo_pages",
    kind: "content",
    description: "Manage page-specific metadata, canonicals and image alt text.",
  },
  {
    slug: "redirects",
    label: "Redirects",
    table: "redirects",
    kind: "content",
    description: "Manage legacy URL redirects and destination paths.",
  },
  {
    slug: "enquiries",
    label: "Website Enquiries",
    table: "website_enquiries",
    kind: "lead",
    description: "Review general, project and location enquiries.",
  },
  {
    slug: "quotation-requests",
    label: "Quotation Requests",
    table: "quotation_requests",
    kind: "lead",
    description: "Review product and wishlist quotation requests.",
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

  return (data || []).map((row) => ({
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
}

