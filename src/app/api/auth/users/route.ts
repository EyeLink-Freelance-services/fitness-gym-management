// app/api/company/overview/route.ts
import { getPermissionStringTable } from "@/lib/formatters/format-permission";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createSupabaseRouteClient(req, res);

  const { data, error } = await supabase.rpc("ensure_active_company_or_personal_workspace");

  if (error) {
    return NextResponse.json({ok: false,  error: error.message }, { status: 400 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "No profile created yet" },
      { status: 404 }
    );
  }

  const permissions = getPermissionStringTable(data.permissions ?? []);

  console.log(data, "data");

  return NextResponse.json({
    data: {
      ...data,
      permissions,
    },
  });
}