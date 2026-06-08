import { clientEnv } from "@/lib/env";

type TokenGetter = () => Promise<string | null>;

export async function apiRequest<T>(
  path: string,
  getToken: TokenGetter,
  init?: RequestInit,
): Promise<T> {
  const token = await getToken();

  const response = await fetch(`${clientEnv.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail ?? payload?.error ?? "Request failed.");
  }

  return response.json() as Promise<T>;
}
