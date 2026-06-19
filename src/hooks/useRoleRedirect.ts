"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { getDefaultRouteFromClaims } from "@/config/routes.config";
import { ROUTES } from "@/constants/route";

export function useRoleRedirect() {
  const router = useRouter();

  const redirectToRoleDashboard = useCallback(async () => {
    const session = await getSession();
    const destination =
      getDefaultRouteFromClaims(session?.claims ?? null) ?? ROUTES.LOGIN;

    router.replace(destination);
    router.refresh();
  }, [router]);

  return { redirectToRoleDashboard };
}
