import { NextResponse } from "next/server";
import { findReplacementProduct } from "@/lib/recommendations/buildLookbook";
import type { BuildLookAnswers } from "@/app/types/domain";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      category: string;
      excludeIds: string[];
      answers?: BuildLookAnswers;
    };
    const product = await findReplacementProduct(body);
    if (!product) {
      return NextResponse.json({ product: null, message: "No alternatives available" });
    }
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[products/replace]", err);
    return NextResponse.json({ error: "Replace failed" }, { status: 500 });
  }
}
