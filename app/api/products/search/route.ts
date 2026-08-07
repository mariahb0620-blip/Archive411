import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/catalog/getCatalog";
import { searchCatalog } from "@/app/services/catalog.service";
import type { SearchFilters } from "@/app/types/domain";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? undefined;
  const city = searchParams.get("city") ?? undefined;
  const independentOnly = searchParams.get("independent") === "true";

  const filters: SearchFilters = {
    query,
    city,
    independentOnly,
  };

  try {
    const pool = await getCatalogProducts();
    const products = searchCatalog(filters, undefined, pool);
    return NextResponse.json({ products, total: products.length });
  } catch (err) {
    console.error("[products/search]", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
