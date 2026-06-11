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

// Get current session and extracts the accessToken
async function getBearerToken(): Promise<string> {
  const session = await getAuthSession();
  if (!session?.accessToken) throw new Error("No active session");
  return session.accessToken;
}
// Fetches the token and returns a JSON
export async function backendGet<T>(path: string): Promise<T> {
  const token = await getBearerToken();

  const res = await fetch(backendUrl(path), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
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
    throw new Error(`Backend API request failed: ${message}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend API error ${res.status}: ${text}`);
  }

  if (res.status === 201 || res.status === 204) return {} as T;

  const text = await res.text();
  if (!text.trim()) return {} as T;

  return JSON.parse(text) as T;
}

export async function backendPut<T>(path: string, body: unknown): Promise<T> {
  const token = await getBearerToken();

  const res = await fetch(backendUrl(path), {
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
    const bodyObj = body as Record<string, unknown> | null;
    const information =
      bodyObj && typeof bodyObj === "object"
        ? (bodyObj["information"] as Record<string, unknown> | undefined)
        : undefined;
    const email =
      information && typeof information === "object"
        ? information["email"]
        : undefined;
    const keys =
      bodyObj && typeof bodyObj === "object" ? Object.keys(bodyObj) : [];

    throw new Error(
      `Backend API error ${res.status}: ${text}\n` +
        `Debug request: keys=${JSON.stringify(keys)} information.email=${JSON.stringify(email)}`,
    );
  }

  if (res.status === 204) return {} as T;
  return {} as Promise<T>;
}
