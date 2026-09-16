import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function readContentRows(supabase: SupabaseClient, table: string, publishedOnly = false) {
  const rows = [];
  const pageSize = 200;
  for (let offset = 0; ; offset += pageSize) {
    let query = supabase.from(table)
      .select("id,title,slug,status,display_order,image_url,image_alt,content,created_at,updated_at")
      .order("display_order", { ascending: true }).order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (publishedOnly) query = query.eq("status", "published");
    const { data, error } = await query;
    if (error) throw new Error(`Could not load ${table}. Please try again.`, { cause: error });
    rows.push(...(data || []));
    if (!data || data.length < pageSize) return rows;
  }
}
