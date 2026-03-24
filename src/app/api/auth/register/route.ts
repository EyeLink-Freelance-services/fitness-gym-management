"use server";

import { ROUTES } from "@/constants/route";
import { CALLBACK_ENDPOINT } from "@/constants/urls";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

type RegisterBody = {
  email: string;
  password: string;
};

function isRegisterBody(obj: any): obj is RegisterBody {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.email === "string" &&
    typeof obj.password === "string"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!isRegisterBody(body)) {
      return NextResponse.json(
        { ok: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const next = url.searchParams.get("next") || ROUTES.HOME;

    const response = NextResponse.json({ ok: true }, { status: 200 });

    const supabase = await createSupabaseRouteClient(req, response);

    const origin =
      req.headers.get("origin") ??
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const emailRedirectTo = `${origin}${CALLBACK_ENDPOINT}?next=${encodeURIComponent(
      next
    )}`;

    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        emailRedirectTo,
      },
    });

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        data,
        message:
          data.user && !data.session
            ? "Account created. Please check your email to confirm your account."
            : "Account created successfully.",
      },
      { status: 200, headers: response.headers }
    );
  } catch (err: any) {
    console.error("Register error:", err);

    return NextResponse.json(
      { ok: false, message: err.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}