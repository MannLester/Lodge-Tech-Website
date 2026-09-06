export const accessRoles = ["USER", "MANAGER", "ADMIN"] as const;

export type AccessRole = (typeof accessRoles)[number];

export type Permission =
  "crm.read" | "crm.write" | "reports.read" | "access.manage" | "audit.read";

const rolePermissions: Record<AccessRole, Permission[]> = {
  USER: ["crm.read", "crm.write"],
  MANAGER: ["crm.read", "crm.write", "reports.read"],
  ADMIN: [
    "crm.read",
    "crm.write",
    "reports.read",
    "access.manage",
    "audit.read",
  ],
};

export function isAccessRole(value: unknown): value is AccessRole {
  return typeof value === "string" && accessRoles.includes(value as AccessRole);
}

export function can(role: AccessRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function permissionsForRole(role: AccessRole): Permission[] {
  return [...rolePermissions[role]];
}
