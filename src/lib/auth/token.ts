import { jwtDecode } from "jwt-decode";
import { AUTH_CONFIG } from "@/lib/auth/config";
import type { AccessTokenClaims } from "@/types/auth/token";

export function decodeAccessToken(token: string): AccessTokenClaims {
  return jwtDecode<AccessTokenClaims>(token);
}

export function shouldDecodeTokenOnClient(): boolean {
  return AUTH_CONFIG.decodeAccessTokenOnClient;
}
