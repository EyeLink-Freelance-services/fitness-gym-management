import { getRouteAuthClient } from "@/lib/db/route-client";
import { RecoveryNewPasswordFormData } from "@/types/forms";
import { NextRequest, NextResponse } from "next/server";

function isRecoveryNewPasswordFormData(obj: any): obj is RecoveryNewPasswordFormData {
	return (
		typeof obj === "object" &&
		obj !== null &&
		typeof obj.password === "string" &&
		typeof obj.confirmPassword === "string"
	);
}

export async function POST(req: NextRequest) {
    try {
    const body = await req.json();

    if(!isRecoveryNewPasswordFormData(body)) {
        return NextResponse.json(
					{ ok: false, message: 'Invalid payload'},
					{ status: 400 }
        )
    }

		const response = NextResponse.json({ok: true});

		const authClient = await getRouteAuthClient(req, response);

    const { data: userData } = await authClient.auth.getUser();
		if(!userData.user) {
			return NextResponse.json(
				{ ok: false, message: 'session expired. Please retry the reset link.' },
				{ status: 401 }
			);
		}

		const { error } = await authClient.auth.updateUser({password: body.confirmPassword});
		if(error) {
			return NextResponse.json({ ok: false, message: error.message });
		}
		
		return response;

  } catch (err: any) {
    console.error("new password update error:", err); // <--- log for debugging
    return NextResponse.json(
			{ ok: false, message: err.message },
			{ status: 500 }
		);
  }
}