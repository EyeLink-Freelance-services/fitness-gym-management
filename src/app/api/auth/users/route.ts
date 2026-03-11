// app/api/company/overview/route.ts
import { getPermissionStringTable } from "@/lib/formatters/format-permission";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createSupabaseRouteClient(req, res);
  const { data, error } = await supabase.rpc("ensure_active_company");

  const permissions = getPermissionStringTable(data.permissions);

  console.log(data, 'data')

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ data: {...data, permissions: permissions} });
}