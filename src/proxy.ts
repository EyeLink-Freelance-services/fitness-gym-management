import { ROUTES } from "@/constants/route";
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
	const pathname = req.nextUrl.pathname;

	// Temporary migration
	if (isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
  }

	void isPublicRoute(pathname, ROUTES.RESET_PASSWORD.NEW_PASSWORD);

	return res
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	]
};