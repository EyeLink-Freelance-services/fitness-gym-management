import { getRouteAuthClient } from "@/lib/db/route-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({ok: true});

    const authClient = await getRouteAuthClient(req, res);
    await authClient.auth.signOut();

    return res
    
  } catch(err: any) {
    console.error("Logout error:", err); // <--- log for debugging
    return NextResponse.json(
			{ ok: false, message: err.message },
			{ status: 500 }
		);
  }
}