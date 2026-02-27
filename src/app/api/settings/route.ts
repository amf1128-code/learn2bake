import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase
    .from("site_settings")
    .select("data")
    .eq("key", "global")
    .single();
  return NextResponse.json(data?.data || {});
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "global", data: body });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
