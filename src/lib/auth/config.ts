export const AUTH_CONFIG = {
  apiBaseUrl:
    process.env.AUTH_API_URL ??   
    process.env.NEXT_PUBLIC_API_URL ??
    "",
  accessTokenTtlSeconds: Number(process.env.AUTH_ACCESS_TOKEN_TTL_SECONDS ?? "900"),
  refreshLeewaySeconds: Number(process.env.AUTH_REFRESH_LEEWAY_SECONDS ?? "45"),
  passwordResetStartPath:
    process.env.AUTH_PASSWORD_RESET_START_PATH ?? "/api/auth/reset/start",
  passwordResetConfirmPath:
    process.env.AUTH_PASSWORD_RESET_CONFIRM_PATH ?? "/api/auth/reset/confirm",
  decodeAccessTokenOnClient:
    (process.env.NEXT_PUBLIC_AUTH_DECODE_ACCESS_TOKEN ?? "true").toLowerCase() !==
    "false",
  accessTokenStorageKey:
    process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN_STORAGE_KEY ?? "auth.accessToken",
} as const;
