import { ROUTES } from "@/constants/route";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const nextPage = url.searchParams.get('next') || ROUTES.RESET_PASSWORD.NEW_PASSWORD;

    if(!code) {
        const noCodeUrl = new URL(ROUTES.RESET_PASSWORD.NO_CODE_ERROR, req.url);
        return NextResponse.redirect(noCodeUrl)
    }

    const nextPageUrl = new URL(nextPage, req.url);
    const response = NextResponse.redirect(nextPageUrl);

    const supabase = await createSupabaseRouteClient(req, response);
    const {error} =  await supabase.auth.exchangeCodeForSession(code);

    if(error) {
        const invalidOrExpiredUrl = new URL(ROUTES.RESET_PASSWORD.INVALID_OR_EXPIRED, req.url);
        return NextResponse.redirect(invalidOrExpiredUrl);
    }

    return response;
}