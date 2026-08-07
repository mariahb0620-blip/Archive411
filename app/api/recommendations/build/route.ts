import { NextResponse } from "next/server";
import type { BuildLookAnswers } from "@/app/types/domain";
import { buildLookbookRecommendation } from "@/lib/recommendations/buildLookbook";

export async function POST(request: Request) {
  try {
    const answers = (await request.json()) as BuildLookAnswers;
    const result = await buildLookbookRecommendation(answers);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[recommendations/build]", err);
    return NextResponse.json(
      { error: "Failed to generate lookbook", empty: true },
      { status: 500 }
    );
  }
}
