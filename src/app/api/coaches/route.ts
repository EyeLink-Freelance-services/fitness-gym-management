import { getCoachesByACompany } from "@/lib/db/queries/coaches";
import { getProfile } from "@/lib/db/queries/profile";
import { getRouteAuthClient } from "@/lib/db/route-client";
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
    const coaches = await getCoachesByACompany(profile.active_company_id);

    return NextResponse.json({ok: true,  data: coaches });

  } catch (err: any) {  
    console.log(err, 'get coach error')
    return NextResponse.json({ ok: false,  message: err.message }, { status: 500 });
  }
}