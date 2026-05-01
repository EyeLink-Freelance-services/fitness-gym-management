"use client";

import { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
const TRIGGER_BEFORE_EXPIRY_MS = 35 * 1_000;

export function SessionAutoRefresh() {
  const { data: session, status } = useSession();

  const accessTokenExpiresAt =
    status === "authenticated"
      ? (session as { accessTokenExpiresAt?: number })?.accessTokenExpiresAt
      : undefined;

  useEffect(() => {
    if (!accessTokenExpiresAt) return;

    const refreshAt = accessTokenExpiresAt - TRIGGER_BEFORE_EXPIRY_MS;

    const delay = refreshAt - Date.now();

    if (delay <= 0) {
      getSession();
      return;
    }

    const timer = setTimeout(() => {
      getSession();
    }, delay);

    return () => clearTimeout(timer);
  }, [accessTokenExpiresAt]);

  return null;
}
