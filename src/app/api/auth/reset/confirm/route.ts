import { confirmPasswordReset } from "@/lib/auth/backend-auth-api";
import { NextRequest, NextResponse } from "next/server";

type ResetConfirmPayload = {
	token: string;
	password: string;
	confirmPassword: string;
};

function isResetConfirmPayload(obj: any): obj is ResetConfirmPayload {
	return (
		typeof obj === "object" &&
		obj !== null &&
		typeof obj.token === "string" &&
		typeof obj.password === "string" &&
		typeof obj.confirmPassword === "string"
	);
}

export async function POST(req: NextRequest) {
    try {
    const body = await req.json();

    if(!isResetConfirmPayload(body)) {
        return NextResponse.json(
					{ ok: false, message: 'Invalid payload'},
					{ status: 400 }
        )
    }

		await confirmPasswordReset({
			token: body.token,
			password: body.password,
			confirmPassword: body.confirmPassword,
		});
		
		return NextResponse.json({ok: true});

  } catch (err: any) {
    console.error("new password update error:", err); // <--- log for debugging
    return NextResponse.json(
			{ ok: false, message: err.message },
			{ status: 500 }
		);
  }
}