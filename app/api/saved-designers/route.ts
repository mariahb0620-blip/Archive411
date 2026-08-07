import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("saved_designers")
    .select("designer_id, followed, created_at")
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ designers: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { designerId, followed = true } = await request.json();
  if (!designerId) {
    return NextResponse.json({ error: "designerId required" }, { status: 400 });
  }

  const { error } = await supabase.from("saved_designers").upsert({
    user_id: user.id,
    designer_id: designerId,
    followed,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const designerId = searchParams.get("designerId");
  if (!designerId) {
    return NextResponse.json({ error: "designerId required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("saved_designers")
    .delete()
    .eq("user_id", user.id)
    .eq("designer_id", designerId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
