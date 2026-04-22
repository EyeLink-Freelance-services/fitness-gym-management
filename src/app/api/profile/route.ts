import { getProfile, updateProfile } from "@/lib/db/queries/profile";
import { getRouteAuthClient } from "@/lib/db/route-client";
import { ProfileUpdateSchema } from "@/lib/validation/schemas/profile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const response = NextResponse.json({ok: true});
		const authClient = await getRouteAuthClient(req, response);
	
		const { data: {user}} = await authClient.auth.getUser();
		if(!user) {
			return NextResponse.json({ok: false, message: "Session expired, please login again"},  { status: 401 })
		}
	
		const profile = await getProfile(user.id);
		if (!profile) return NextResponse.json({ok: false,  message: "Not found, please check network" }, { status: 404 });
	
		return NextResponse.json({ ok: true, data: {...profile, email: user.email} });

	} catch(err: any) {
		console.log(err, 'error')
		return NextResponse.json(
			{ ok: false, message: err.message },
			{ status: 500 }
		);
	}
}

export async function PUT(req: NextRequest) {
	let userUpdated: any = null;

	const response = NextResponse.json({ok: true});
	const authClient = await getRouteAuthClient(req, response);

	const { data: {user}} = await authClient.auth.getUser();
	if(!user) {
		return NextResponse.json({ok: false, message: "Session expired, please login again"},  { status: 401 })
	}
	
	try {
		const body = await req.json();
		const parsed = ProfileUpdateSchema.safeParse(body);
		
		if(!parsed.success) {
			return NextResponse.json(
				{ ok: false, message: 'Invalid payload', issues: parsed.error.flatten() },
				{ status: 400 }
			)
		}
	
		const userAuthPayload = {
			email: parsed.data.email,
		};
	
		const profilePayload = {
			first_name: parsed.data.first_name,
			last_name: parsed.data.last_name,
			phone: parsed.data.phone
		};

		userUpdated = await authClient.auth.updateUser(userAuthPayload);
		console.log(userUpdated, 'userUpdated');
		const profileUpdated = await updateProfile(user.id, profilePayload);

		return NextResponse.json({ ok: true, data: {...profileUpdated, email: userUpdated.email} });

	} catch(err: any) {
		// Rollback user update if profile update fails
		if(userUpdated) {
			await authClient.auth.updateUser({ email: user.email });
		}
		console.log(err, 'error')
		return NextResponse.json(
			{ ok: false, message: err.message },
			{ status: 500 }
		);
	}
}