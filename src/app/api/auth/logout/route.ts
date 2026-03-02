import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({ok: true});

    const supabase = await createSupabaseRouteClient(req, res);
    await supabase.auth.signOut();

    return res
    
  } catch(err: any) {
    console.error("Logout error:", err); // <--- log for debugging
    return NextResponse.json(
			{ ok: false, message: err.message },
			{ status: 500 }
		);
  }
}