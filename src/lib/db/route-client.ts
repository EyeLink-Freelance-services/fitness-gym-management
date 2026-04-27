import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/auth";
import { RouteAuthClient } from "@/types/auth/auth-context";

export async function getRouteAuthClient(
  _req: NextRequest,
  _res: NextResponse,
): Promise<RouteAuthClient> {
  const session = await getAuthSession();

  return {
    auth: {
      getUser: async () => {
        if (!session?.claims) {
          return { data: { user: null }, error: null };
        }

        return {
          data: {
            user: {
              id: session.claims.userId ?? session.claims.sub ?? "",
              email: session.claims.email ?? session.claims.sub ?? "",
            },
          },
          error: null,
        };
      },
    },
  };
}
