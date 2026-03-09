"use server";

import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { LoginFormData } from "@/types/forms";
import { NextRequest, NextResponse } from "next/server";

function isLoginFormData(obj: any): obj is LoginFormData {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.email === "string" &&
    typeof obj.password === "string"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if(!isLoginFormData(body)) {
        return NextResponse.json(
					{ ok: false, message: 'Invalid payload'},
					{ status: 400 }
        )
    }

		const response = NextResponse.json({ok: true}, {status: 200});

		const supabase = await createSupabaseRouteClient(req, response);

    const { error } = await supabase.auth.signInWithPassword(body);

    if (error) {
      return NextResponse.json(
				{ ok: false, message: error.message },
				{ status: 401 }
			);
    }

		response.headers.set('content-type', 'application/json');
		
		return response;

  } catch (err: any) {
    console.error("Login error:", err); // <--- log for debugging
    return NextResponse.json(
			{ ok: false, message: err.message },
			{ status: 500 }
		);
  }
}