import { NextResponse } from "next/server";
import { getAuthUser, getRequestSupabase } from "@/lib/supabase/server";
import { getLookbookById, mapProductRow } from "@/lib/db/mappers";
import { getCatalogProducts } from "@/lib/catalog/getCatalog";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const stored = await getLookbookById(user.id, id);
    if (!stored) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const allProducts = await getCatalogProducts();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    // Hydrate from DB if products exist there
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await getRequestSupabase();
      const { data: dbProducts } = await supabase
        .from("products")
        .select("*")
        .in("id", stored.productIds);
      (dbProducts ?? []).forEach((row) => {
        productMap.set(row.id as string, mapProductRow(row));
      });
    }

    const products = stored.productIds
      .map((pid) => productMap.get(pid))
      .filter(Boolean);

    return NextResponse.json({
      lookbook: stored.lookbook,
      looks: stored.looks,
      products,
    });
  } catch (err) {
    console.error("[lookbooks/id GET]", err);
    return NextResponse.json({ error: "Failed to load lookbook" }, { status: 500 });
  }
}
