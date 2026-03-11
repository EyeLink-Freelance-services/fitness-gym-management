import { ROUTES } from "@/constants/route";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.RESET_PASSWORD.NEW_PASSWORD];
const PROTECTED_PREFIXES = [
	ROUTES.HOME, 
	ROUTES.MEMBERS.LIST_MEMBER, 
	ROUTES.MEMBERSHIP.LIST_MEMBERSHIP
];

function isProtectedRoute(pathname: string) {
  return PROTECTED_PREFIXES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );
}

function isPublicRoute(pathname: string, except?: string) {
  if (except && pathname.startsWith(except)) {
    return false;
  }

  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

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
	if (!user && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
  }

	// Block public auth pages when logged in
	if (user && isPublicRoute(pathname, ROUTES.RESET_PASSWORD.NEW_PASSWORD)) {
    return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
  }

	return res
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	]
};