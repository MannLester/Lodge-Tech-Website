import type { User } from "@supabase/supabase-js";

export type AdminSession = {
  authMode: "google";
  email: string;
  role: "admin";
  sub: string;
};

export type AdminEmailLookup = (email: string) => Promise<boolean>;

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
  isAllowedAdminEmail: AdminEmailLookup,
): Promise<AdminSession | null> {
  if (!user.email || !user.email_confirmed_at || !hasGoogleIdentity(user)) {
    return null;
  }

  const email = normalizeAdminEmail(user.email);
  const allowed = await isAllowedAdminEmail(email);

  if (!allowed) return null;

  return {
    authMode: "google",
    email,
    role: "admin",
    sub: user.id,
  };
}
