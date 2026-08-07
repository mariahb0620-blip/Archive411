import type { Designer, Product } from "@/app/types/domain";
import { createClient } from "@/lib/supabase/server";
import { mapDesignerRow, mapProductRow } from "@/lib/db/mappers";
import {
  LOCAL_DESIGNERS,
  LOCAL_PRODUCTS,
} from "@/lib/catalog/verifiedPool";

export {
  getVerifiedDesignersSync,
  getVerifiedProductsSync,
  LOCAL_DESIGNERS,
  LOCAL_PRODUCTS,
} from "@/lib/catalog/verifiedPool";

export async function getCatalogProducts(): Promise<Product[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_reference_example", false)
        .order("updated_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(mapProductRow);
      }
    } catch {
      // fall through to local seed
    }
  }
  return LOCAL_PRODUCTS;
}

export async function getCatalogDesigners(): Promise<Designer[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("designers")
        .select("*")
        .eq("is_reference_example", false);
      if (!error && data && data.length > 0) {
        return data.map(mapDesignerRow);
      }
    } catch {
      // fall through
    }
  }
  return LOCAL_DESIGNERS;
}
