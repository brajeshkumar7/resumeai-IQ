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
