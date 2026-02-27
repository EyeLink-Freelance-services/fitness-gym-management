import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Next.js server components can set cookies
        // NOTE: In Route Handlers you may prefer NextResponse and set cookies on the response.
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
