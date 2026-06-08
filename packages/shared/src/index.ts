export type DependencyStatus = "healthy" | "unhealthy" | "not_configured";

export type PlatformDependency = {
  name: string;
  status: DependencyStatus;
  message: string;
};

export type PlatformMeta = {
  application: {
    name: string;
    environment: string;
    version: string;
  };
  capabilities: string[];
  guardrails: string[];
  dependencies: PlatformDependency[];
};

export type UserProfile = {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  profile_metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type SessionData = {
  user_id: string;
  session_id: string | null;
  issuer: string | null;
  authorized_party: string | null;
  profile: UserProfile | null;
};
