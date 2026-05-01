"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { getDefaultRoute, isRouteAllowed } from "@/config/role.config";

export function useAuthGuard() {
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const permissions = auth?.permissions ?? [];
  const isAllowed = isRouteAllowed(pathname, permissions);

  useEffect(() => {
    if (!isAllowed) {
      router.replace(getDefaultRoute(permissions));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllowed]);

  return { auth, isAllowed };
}
