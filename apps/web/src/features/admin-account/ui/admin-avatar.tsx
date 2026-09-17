/* eslint-disable @next/next/no-img-element */

import {
  getAdminInitials,
  type AdminAccount,
} from "@/features/admin-account/model/admin-account";

export function AdminAvatar({
  account,
  size = "small",
}: {
  account: AdminAccount;
  size?: "large" | "small";
}) {
  const dimensions = size === "large" ? "size-24 text-2xl" : "size-10 text-sm";

  return account.avatarPath ? (
    <img
      alt={`${account.displayName}'s profile`}
      className={`${dimensions} border-border shrink-0 rounded-full border object-cover`}
      height={size === "large" ? 96 : 40}
      src={`/api/admin/avatar?v=${encodeURIComponent(account.updatedAt ?? account.avatarPath)}`}
      width={size === "large" ? 96 : 40}
    />
  ) : (
    <span
      aria-hidden="true"
      className={`${dimensions} bg-brand-soft text-brand-strong grid shrink-0 place-items-center rounded-full font-bold`}
    >
      {getAdminInitials(account.displayName)}
    </span>
  );
}
