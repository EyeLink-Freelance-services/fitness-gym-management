import { ROUTES } from "@/constants/route";
import { requestPasswordReset } from "@/lib/auth/backend-auth-api";
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

		const redirectTo = new URL(ROUTES.RESET_PASSWORD.NEW_PASSWORD, req.url).toString()
    await requestPasswordReset({ email: body.email, redirectTo });
		
		return NextResponse.json({ok: true});

  } catch (err: any) {
    console.error("reset error:", err); // <--- log for debugging
    return NextResponse.json(
			{ ok: false, message: err.message },
			{ status: 500 }
		);
  }
}