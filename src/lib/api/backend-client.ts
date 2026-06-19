import { AUTH_CONFIG } from "@/lib/auth/config";
import { getAuthSession } from "@/auth";

const API_DEBUG = process.env.NODE_ENV === "development";

function backendUrl(path: string): string {
  if (!AUTH_CONFIG.apiBaseUrl) {
    throw new Error(
      "AUTH_API_URL or NEXT_PUBLIC_API_URL must be configured for backend API calls.",
    );
  }
  return new URL(path, AUTH_CONFIG.apiBaseUrl).toString();
}

function summarizeResponse(data: unknown): unknown {
  if (Array.isArray(data)) {
    return { type: "array", length: data.length, firstItem: data[0] };
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const summary: Record<string, unknown> = {
      keys: Object.keys(record),
    };

    for (const [key, value] of Object.entries(record)) {
      if (Array.isArray(value)) {
        summary[key] = { length: value.length, firstItem: value[0] };
      }
    }

    return summary;
  }

  return data;
}

function logRequest(method: string, path: string, body?: unknown) {
  if (!API_DEBUG) return;

  console.log(`[API] → ${method} ${path}`);
  if (body !== undefined) {
    console.log("[API]   body:", body);
  }
}

function logResponse(method: string, path: string, status: number, data?: unknown) {
  if (!API_DEBUG) return;

  console.log(`[API] ← ${method} ${path} ${status}`);
  if (data !== undefined) {
    console.log("[API]   response:", summarizeResponse(data));
  }
}

function logError(method: string, path: string, status: number, text: string) {
  if (!API_DEBUG) return;

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

  logRequest("GET", path);

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

  const data = (await res.json()) as T;
  logResponse("GET", path, res.status, data);
  return data;
}

export async function backendPost<T>(path: string, body: unknown): Promise<T> {
  const token = await getBearerToken();
  const url = backendUrl(path);

  logRequest("POST", path, body);

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
    if (API_DEBUG) {
      console.error(`[API] ✕ POST ${path} network error:`, message);
    }
    throw new Error(`Backend API request failed: ${message}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logError("POST", path, res.status, text);
    throw new Error(`Backend API error ${res.status}: ${text}`);
  }

  if (res.status === 201 || res.status === 204) {
    logResponse("POST", path, res.status);
    return {} as T;
  }

  const data = await parseSuccessBody<T>(res);
  logResponse("POST", path, res.status, data);
  return data;
}

export async function backendPut<T>(path: string, body: unknown): Promise<T> {
  const token = await getBearerToken();
  const url = backendUrl(path);

  logRequest("PUT", path, body);

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

  logResponse("PUT", path, res.status);
  return {} as Promise<T>;
}

export async function backendDelete(path: string): Promise<void> {
  const token = await getBearerToken();
  const url = backendUrl(path);

  logRequest("DELETE", path);

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

  logResponse("DELETE", path, res.status);
}
