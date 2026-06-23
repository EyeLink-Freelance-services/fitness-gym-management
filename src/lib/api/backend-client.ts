import { AUTH_CONFIG } from "@/lib/auth/config";
import { getAuthSession } from "@/auth";

function backendUrl(path: string): string {
  if (!AUTH_CONFIG.apiBaseUrl) {
    throw new Error(
      "AUTH_API_URL or NEXT_PUBLIC_API_URL must be configured for backend API calls.",
    );
  }
  return new URL(path, AUTH_CONFIG.apiBaseUrl).toString();
}

function logError(method: string, path: string, status: number, text: string) {
  console.error(`[API] ✕ ${method} ${path} ${status}`);
  console.error("[API]   error:", text.slice(0, 500));
}

async function getBearerToken(): Promise<string> {
  const session = await getAuthSession();
  if (!session?.accessToken) throw new Error("No active session");
  return session.accessToken;
}

async function parseSuccessBody<T>(res: Response): Promise<T> {
  if (res.status === 204) return {} as T;

  const text = await res.text();
  if (!text.trim()) return {} as T;

  return JSON.parse(text) as T;
}

export async function backendGet<T>(path: string): Promise<T> {
  const token = await getBearerToken();
  const url = backendUrl(path);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logError("GET", path, res.status, text);
    throw new Error(`Backend API error ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}

export async function backendPost<T>(path: string, body: unknown): Promise<T> {
  const token = await getBearerToken();
  const url = backendUrl(path);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[API] ✕ POST ${path} network error:`, message);
    throw new Error(`Backend API request failed: ${message}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logError("POST", path, res.status, text);
    throw new Error(`Backend API error ${res.status}: ${text}`);
  }

  if (res.status === 201 || res.status === 204) {
    return {} as T;
  }

  return parseSuccessBody<T>(res);
}

export async function backendPut<T>(path: string, body: unknown): Promise<T> {
  const token = await getBearerToken();
  const url = backendUrl(path);

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logError("PUT", path, res.status, text);
    throw new Error(`Backend API error ${res.status}: ${text}`);
  }

  return {} as Promise<T>;
}

export async function backendDelete(path: string): Promise<void> {
  const token = await getBearerToken();
  const url = backendUrl(path);

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logError("DELETE", path, res.status, text);
    throw new Error(`Backend API error ${res.status}: ${text}`);
  }

}
