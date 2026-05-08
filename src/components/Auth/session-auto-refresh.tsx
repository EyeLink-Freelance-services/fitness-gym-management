"use client";

import { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
const TRIGGER_BEFORE_EXPIRY_MS = 35 * 1_000;
const HEARTBEAT_MS = 60 * 1_000;

export function SessionAutoRefresh() {
  const { data: session, status } = useSession();

  const accessTokenExpiresAt =
    status === "authenticated"
      ? (session as { accessTokenExpiresAt?: number })?.accessTokenExpiresAt
      : undefined;

  useEffect(() => {
    if (!accessTokenExpiresAt) return;

    const refreshNowIfNeeded = () => {
      const refreshAt = accessTokenExpiresAt - TRIGGER_BEFORE_EXPIRY_MS;
      if (Date.now() >= refreshAt) {
        getSession();
      }
    };

    refreshNowIfNeeded();

    const heartbeat = window.setInterval(() => {
      refreshNowIfNeeded();
    }, HEARTBEAT_MS);

    const onFocus = () => {
      getSession();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        getSession();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(heartbeat);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [accessTokenExpiresAt]);

  return null;
}
