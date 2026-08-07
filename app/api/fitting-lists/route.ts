import { NextResponse } from "next/server";
import { getAuthUser, getRequestSupabase } from "@/lib/supabase/server";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await getRequestSupabase();
  const { data, error } = await supabase
    .from("fitting_lists")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lists: data ?? [] });
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await getRequestSupabase();
  const body = await request.json();
  const id = body.id ?? `fl-${Date.now()}`;
  const { error } = await supabase.from("fitting_lists").upsert({
    id,
    user_id: user.id,
    showroom_id: body.showroomId ?? null,
    title: body.title ?? "Fitting list",
    items: body.items ?? [],
    notes: body.notes ?? null,
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id });
}
