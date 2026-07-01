import { AUTH_CONFIG } from "@/lib/auth/config";
import { ApiErrorBody, AuthApiResponse, AuthTokens, LoginPayload } from "@/types/auth/auth-context";

function endpoint(pathname: string): string {
  if (!AUTH_CONFIG.apiBaseUrl) {
    throw new Error(
      "AUTH_API_URL or NEXT_PUBLIC_API_URL must be configured for auth flows.",
    );
  }
  return new URL(pathname, AUTH_CONFIG.apiBaseUrl).toString();
}

function readRefreshToken(setCookieHeader: string | null): string | null {
  if (!setCookieHeader) return null;

  const match = setCookieHeader.match(/(?:^|,\s*)refreshToken=([^;,\s]+)/);
  return match?.[1] ?? null;
}

async function parseBody<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function errorMessage(data: ApiErrorBody | null, fallback: string): string {
  if (!data) return fallback;
  return data.message ?? data.error ?? data.detail ?? data.title ?? fallback;
}

export async function loginWithBackend(payload: LoginPayload): Promise<AuthTokens> {
  const res = await fetch(endpoint("/api/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseBody<AuthApiResponse & ApiErrorBody>(res);
  if (!res.ok || !data?.access_token) {
    throw new Error(errorMessage(data, "Invalid username or password"));
  }

  const refreshToken = readRefreshToken(res.headers.get("set-cookie"));
  if (!refreshToken) {
    throw new Error("Missing refresh token cookie from backend login response");
  }

  return {
    accessToken: data.access_token,
    refreshToken,
    tokenType: data.token_type ?? "Bearer",
    expiresIn: data.expires_in ?? AUTH_CONFIG.accessTokenTtlSeconds,
  };
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthTokens> {
  const res = await fetch(endpoint("/api/auth/refresh"), {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

  const data = await parseBody<AuthApiResponse & ApiErrorBody>(res);
  if (!res.ok || !data?.access_token) {
    throw new Error(errorMessage(data, "Session expired"));
  }

  const rotatedRefreshToken =
    readRefreshToken(res.headers.get("set-cookie")) ?? refreshToken;

  return {
    accessToken: data.access_token,
    refreshToken: rotatedRefreshToken,
    tokenType: data.token_type ?? "Bearer",
    expiresIn: data.expires_in ?? AUTH_CONFIG.accessTokenTtlSeconds,
  };
}

export async function logoutFromBackend(refreshToken: string): Promise<void> {
  await fetch(endpoint("/api/auth/logout"), {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });
}
