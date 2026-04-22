// app/api/company/overview/route.ts
import { buildAuthContext } from "@/lib/auth/get-auth-context";
import { getRouteAuthClient } from "@/lib/db/route-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const authClient = await getRouteAuthClient(req, res);

  const { data, error } =
    await authClient.rpc("ensure_active_company_or_personal_workspace");

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { ok: false, error: "No profile created yet" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    data: await buildAuthContext(data),
  });
}