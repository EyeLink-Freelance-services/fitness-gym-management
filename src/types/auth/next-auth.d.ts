import "next-auth";
import "next-auth/jwt";
import type { AccessTokenClaims } from "@/types/auth/token";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    accessTokenExpiresAt?: number;
    claims?: AccessTokenClaims;
    error?: string;
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    claims?: AccessTokenClaims;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;
    claims?: AccessTokenClaims;
    error?: string;
  }
}
