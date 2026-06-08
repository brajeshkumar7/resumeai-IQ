import type { PlatformMeta } from "@resumeiq/shared";
import { z } from "zod";

import { clientEnv } from "@/lib/env";

const dependencyStatusSchema = z.object({
  name: z.string(),
  status: z.enum(["healthy", "unhealthy", "not_configured"]),
  message: z.string(),
});

const metaResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    application: z.object({
      name: z.string(),
      environment: z.string(),
      version: z.string(),
    }),
    capabilities: z.array(z.string()),
    guardrails: z.array(z.string()),
    dependencies: z.array(dependencyStatusSchema),
  }),
});

export async function getPlatformMeta(): Promise<PlatformMeta> {
  const response = await fetch(`${clientEnv.NEXT_PUBLIC_API_BASE_URL}/api/v1/system/meta`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load platform metadata.");
  }

  const payload = await response.json();
  return metaResponseSchema.parse(payload).data as PlatformMeta;
}
