import { ROUTES } from "@/constants/route";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
	const res = NextResponse.next();

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

	
	const {data} = await supabase.auth.getUser();
	const user = data.user;
	
	console.log(user, 'user');
	const pathname = req.nextUrl.pathname;

	// Protect private routes in (app)
	if(!user && pathname === ROUTES.HOME) {
		return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
	}

	// Block public auth pages when logged in
	if(user && pathname === ROUTES.LOGIN) {
		return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
	}

	return res
}

export const config = {
	matcher: ['/', '/auth/sign-in', '/auth/reset-password']
};