import type { SessionData } from "@resumeiq/shared";

import { apiRequest } from "@/lib/api";

type TokenGetter = () => Promise<string | null>;

type SessionResponse = {
  success: true;
  data: SessionData;
};

type SessionSyncPayload = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
};

export async function syncSession(getToken: TokenGetter, payload: SessionSyncPayload) {
  const response = await apiRequest<SessionResponse>("/api/v1/auth/session", getToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function getSession(getToken: TokenGetter) {
  const response = await apiRequest<SessionResponse>("/api/v1/auth/session", getToken);
  return response.data;
}
