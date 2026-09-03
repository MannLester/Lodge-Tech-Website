import { z } from "zod";

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

let cachedPublicEnv: PublicEnv | undefined;

export function getPublicEnv(): PublicEnv {
  cachedPublicEnv ??= publicEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  return cachedPublicEnv;
}
