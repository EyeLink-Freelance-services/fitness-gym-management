import { ROUTES } from "@/constants/route";
import { RESET_PASSWORD_ENDPOINT } from "@/constants/urls";
import { getRouteAuthClient } from "@/lib/db/route-client";
import { RecoveryRegisteredEmailFormData } from "@/types/forms";
import { NextRequest, NextResponse } from "next/server";

function isRecoveryRegisteredEmailFormData(obj: any): obj is RecoveryRegisteredEmailFormData {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.email === "string"
  );
}

export async function POST(req: NextRequest) {
   try {
    const body = await req.json();

    if(!isRecoveryRegisteredEmailFormData(body)) {
        return NextResponse.json(
					{ ok: false, message: 'Invalid payload'},
					{ status: 400 }
        )
    }

		const response = NextResponse.json({ok: true});

		const authClient = await getRouteAuthClient(req, response);

		const redirectTo = new URL(`${RESET_PASSWORD_ENDPOINT}?next=${ROUTES.RESET_PASSWORD.NEW_PASSWORD}`, req.url).toString()
    await authClient.auth.resetPasswordForEmail(body.email, {redirectTo});
		
		return response;

  } catch (err: any) {
    console.error("reset error:", err); // <--- log for debugging
    return NextResponse.json(
			{ ok: false, message: err.message },
			{ status: 500 }
		);
  }
}