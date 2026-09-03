import "server-only";

import { z } from "zod";

const adminAuthEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  SESSION_SECRET: z.string().min(32),
});

type AdminAuthEnv = z.infer<typeof adminAuthEnvSchema>;

let cachedAdminAuthEnv: AdminAuthEnv | undefined;

export function getAdminAuthEnv(): AdminAuthEnv {
  cachedAdminAuthEnv ??= adminAuthEnvSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    SESSION_SECRET: process.env.SESSION_SECRET,
  });

  return cachedAdminAuthEnv;
}
