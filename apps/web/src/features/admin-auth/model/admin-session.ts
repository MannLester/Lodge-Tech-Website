import type { User } from "@supabase/supabase-js";

import type { AccessRole } from "@/features/admin-auth/model/permissions";

export type AuthMode = "microsoft" | "email";

export type AdminSession = {
  authMode: AuthMode;
  crmUserId: string;
  email: string;
  role: AccessRole;
  sub: string;
};

export type AdminAccountLookup = (
  email: string,
  authUserId: string,
) => Promise<Pick<AdminSession, "crmUserId" | "role"> | null>;

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function resolveAuthMode(
  user: Pick<User, "app_metadata" | "identities">,
): AuthMode | null {
  if (
    user.app_metadata?.provider === "azure" ||
    user.identities?.some((identity) => identity.provider === "azure")
  ) {
    return "microsoft";
  }

  if (
    user.app_metadata?.provider === "email" ||
    user.identities?.some((identity) => identity.provider === "email")
  ) {
    return "email";
  }

  return null;
}

export async function createAdminSessionFromUser(
  user: Pick<
    User,
    "app_metadata" | "email" | "email_confirmed_at" | "id" | "identities"
  >,
  findApprovedAdminAccount: AdminAccountLookup,
): Promise<AdminSession | null> {
  const authMode = resolveAuthMode(user);

  if (!user.email || !user.email_confirmed_at || !authMode) {
    return null;
  }

  const email = normalizeAdminEmail(user.email);
  const account = await findApprovedAdminAccount(email, user.id);

  if (!account) return null;

  return {
    authMode,
    crmUserId: account.crmUserId,
    email,
    role: account.role,
    sub: user.id,
  };
}
