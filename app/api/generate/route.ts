import { NextResponse } from "next/server";
import { buildStylingPrompt } from "@/app/utils/promptBuilder";
import { generateMockLooks } from "@/app/utils/mockLooks";
import {
  DEFAULT_SETTINGS,
  type GenerationSettings,
} from "@/app/types/styling";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerationSettings>;

    const settings: GenerationSettings = {
      ...DEFAULT_SETTINGS,
      ...body,
    };

    const prompt = buildStylingPrompt(settings);
    const looks = generateMockLooks(settings);

    return NextResponse.json({ prompt, looks });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
