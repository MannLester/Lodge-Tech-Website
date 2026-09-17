import { z } from "zod";

export const adminProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  jobTitle: z.string().trim().max(100),
  phone: z.string().trim().max(40),
});

export const adminAvatarTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export const maxAdminAvatarBytes = 2 * 1024 * 1024;

export type AdminAccount = {
  avatarPath: string | null;
  displayName: string;
  email: string;
  jobTitle: string | null;
  phone: string | null;
  updatedAt: string | null;
};

export type AdminAccountResult =
  | { account: AdminAccount; ok: true }
  | { account: AdminAccount; message: string; ok: false };

export function fallbackAdminAccount(email: string): AdminAccount {
  const localPart = email.split("@")[0] ?? "Admin";
  const displayName = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

  return {
    avatarPath: null,
    displayName: displayName || "Admin",
    email,
    jobTitle: null,
    phone: null,
    updatedAt: null,
  };
}

export function getAdminInitials(displayName: string): string {
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "A";
}
