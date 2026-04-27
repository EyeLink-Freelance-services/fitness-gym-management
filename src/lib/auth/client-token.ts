"use client";

import { AUTH_CONFIG } from "@/lib/auth/config";
import { decodeAccessToken, shouldDecodeTokenOnClient } from "@/lib/auth/token";
import type { AccessTokenClaims } from "@/types/auth/token";

export function readStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(AUTH_CONFIG.accessTokenStorageKey);
}

export function readDecodedAccessToken(): AccessTokenClaims | null {
  if (!shouldDecodeTokenOnClient()) return null;

  const token = readStoredAccessToken();
  if (!token) return null;

  try {
    return decodeAccessToken(token);
  } catch {
    return null;
  }
}
