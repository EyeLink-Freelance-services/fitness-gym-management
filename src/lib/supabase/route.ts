import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function createSupabaseRouteClient(req: NextRequest, res: NextResponse) {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
			cookies: {
        getAll() {
            return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
            	res.cookies.set(name, value, options);
            });
        },
			},
    }
  )

	return supabase
}