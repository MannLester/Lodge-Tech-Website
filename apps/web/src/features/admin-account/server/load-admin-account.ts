import "server-only";

import { findAdminAccountByEmail } from "@/features/admin-account/data/admin-account-repository";
import {
  fallbackAdminAccount,
  type AdminAccountResult,
} from "@/features/admin-account/model/admin-account";

export async function loadAdminAccount(
  email: string,
): Promise<AdminAccountResult> {
  const fallback = fallbackAdminAccount(email);
  const { data, error } = await findAdminAccountByEmail(email);

  if (error || !data) {
    console.error("Failed to load admin account", error);
    return {
      account: fallback,
      message:
        "Account settings are unavailable until the admin profile migration is applied.",
      ok: false,
    };
  }

  return {
    account: {
      avatarPath: data.avatar_path,
      displayName: data.display_name ?? fallback.displayName,
      email: data.email,
      jobTitle: data.job_title,
      phone: data.phone,
      updatedAt: data.updated_at,
    },
    ok: true,
  };
}
