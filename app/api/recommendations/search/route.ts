import { NextResponse } from "next/server";
import type { SearchFilters } from "@/app/types/domain";
import { searchLookbookRecommendation } from "@/lib/recommendations/searchLookbook";

export async function POST(request: Request) {
  try {
    const filters = (await request.json()) as SearchFilters;
    const result = await searchLookbookRecommendation(filters);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[recommendations/search]", err);
    return NextResponse.json(
      { error: "Failed to generate search lookbook", empty: true },
      { status: 500 }
    );
  }
}
