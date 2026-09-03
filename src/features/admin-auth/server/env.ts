import "server-only";

import {
  type AdminAuthEnv,
  resolveAdminAuthEnv,
} from "@/features/admin-auth/model/admin-auth-env";

let cachedAdminAuthEnv: AdminAuthEnv | undefined;

export function getAdminAuthEnv(): AdminAuthEnv {
  if (cachedAdminAuthEnv) return cachedAdminAuthEnv;

  cachedAdminAuthEnv = resolveAdminAuthEnv({
    NODE_ENV: process.env.NODE_ENV,
    SESSION_SECRET: process.env.SESSION_SECRET,
  });

  return cachedAdminAuthEnv;
}
