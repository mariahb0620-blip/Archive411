import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/server";
import { listUserLookbooks, saveLookbookToDb } from "@/lib/db/mappers";
import type { BuildLookAnswers, GenerationMethod, Look, Lookbook } from "@/app/types/domain";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lookbooks = await listUserLookbooks(user.id);
    return NextResponse.json({ lookbooks });
  } catch (err) {
    console.error("[lookbooks GET]", err);
    return NextResponse.json({ error: "Failed to load archive" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      lookbook: Lookbook;
      looks: Look[];
      method: GenerationMethod;
      buildPreferences?: BuildLookAnswers;
    };

    await saveLookbookToDb({
      userId: user.id,
      lookbook: { ...body.lookbook, userId: user.id, saved: true },
      looks: body.looks,
      products: [],
      method: body.method,
      buildPreferences: body.buildPreferences,
    });

    return NextResponse.json({ ok: true, lookbook: body.lookbook });
  } catch (err) {
    console.error("[lookbooks POST]", err);
    return NextResponse.json({ error: "Failed to save lookbook" }, { status: 500 });
  }
}
