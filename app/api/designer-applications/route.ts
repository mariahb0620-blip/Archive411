import { NextResponse } from "next/server";
import { getAuthUser, getRequestSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await getAuthUser();
  const supabase = await getRequestSupabase();
  const body = await request.json();
  const id = `app-${Date.now()}`;

  const { error } = await supabase.from("designer_applications").insert({
    id,
    user_id: user?.id ?? null,
    designer_name: body.designerName,
    label_name: body.labelName,
    contact_email: body.contactEmail,
    city: body.city,
    country: body.country,
    website: body.website ?? null,
    instagram: body.instagram ?? null,
    biography: body.biography,
    design_philosophy: body.designPhilosophy ?? null,
    product_categories: body.productCategories ?? [],
    aesthetic_keywords: body.aestheticKeywords ?? [],
    price_range: body.priceRange ?? {},
    size_range: body.sizeRange ?? "",
    custom_sizing: body.customSizing ?? false,
    made_to_order: body.madeToOrder ?? false,
    shipping_regions: body.shippingRegions ?? [],
    connection_type: body.connectionType ?? "manual",
    status: "submitted",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id, status: "submitted" });
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await getRequestSupabase();
  const { data, error } = await supabase
    .from("designer_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applications: data ?? [] });
}
