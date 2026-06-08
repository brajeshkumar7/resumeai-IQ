import type { UserProfile } from "@resumeiq/shared";

import { apiRequest } from "@/lib/api";

type TokenGetter = () => Promise<string | null>;

type UserProfileResponse = {
  success: true;
  data: UserProfile;
};

type ProfilePayload = {
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  profile_metadata: {
    headline?: string;
    target_role?: string;
    linkedin_url?: string;
  };
};

export async function getCurrentProfile(getToken: TokenGetter) {
  const response = await apiRequest<UserProfileResponse>("/api/v1/users/me", getToken);
  return response.data;
}

export async function updateCurrentProfile(getToken: TokenGetter, payload: ProfilePayload) {
  const response = await apiRequest<UserProfileResponse>("/api/v1/users/me", getToken, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return response.data;
}
