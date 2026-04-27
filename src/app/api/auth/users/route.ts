import { getAuthContext } from "@/lib/auth/get-auth-context";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await getAuthContext();

  if (!auth) {
    return NextResponse.json(
      { ok: false, error: "Session expired, please login again" },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true, data: auth });
}