"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { AUTH_CONFIG } from "@/lib/auth/config";

export function SessionStorageSync() {
  const { data, status } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (status !== "authenticated" || !data?.accessToken) {
      window.sessionStorage.removeItem(AUTH_CONFIG.accessTokenStorageKey);
      return;
    }

    window.sessionStorage.setItem(
      AUTH_CONFIG.accessTokenStorageKey,
      data.accessToken,
    );
  }, [data?.accessToken, status]);

  return null;
}
