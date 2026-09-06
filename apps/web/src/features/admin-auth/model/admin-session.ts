import type { User } from "@supabase/supabase-js";

import type { AccessRole } from "@/features/admin-auth/model/permissions";

export type AdminSession = {
  authMode: "google";
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

export function hasGoogleIdentity(
  user: Pick<User, "app_metadata" | "identities">,
) {
  if (user.app_metadata?.provider === "google") return true;

  return (
    user.identities?.some((identity) => identity.provider === "google") ?? false
  );
}

export async function createAdminSessionFromUser(
  user: Pick<
    User,
    "app_metadata" | "email" | "email_confirmed_at" | "id" | "identities"
  >,
  findApprovedAdminAccount: AdminAccountLookup,
): Promise<AdminSession | null> {
  if (!user.email || !user.email_confirmed_at || !hasGoogleIdentity(user)) {
    return null;
  }

  const email = normalizeAdminEmail(user.email);
  const account = await findApprovedAdminAccount(email, user.id);

  if (!account) return null;

  return {
    authMode: "google",
    crmUserId: account.crmUserId,
    email,
    role: account.role,
    sub: user.id,
  };
}
