import { NextResponse } from "next/server";
import { getAuthUser, getRequestSupabase } from "@/lib/supabase/server";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await getRequestSupabase();
  const { data, error } = await supabase
    .from("archive_collections")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ collections: data ?? [] });
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await getRequestSupabase();
  const body = await request.json();
  const id = body.id ?? `col-${Date.now()}`;
  const { error } = await supabase.from("archive_collections").insert({
    id,
    user_id: user.id,
    name: body.name,
    description: body.description ?? null,
    cover_image_url: body.coverImageUrl ?? null,
    visibility: body.visibility ?? "private",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id });
}
