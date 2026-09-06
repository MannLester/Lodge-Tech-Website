"use client";

import { createContext, useContext, type ReactNode } from "react";

import {
  can,
  permissionsForRole,
  type AccessRole,
  type Permission,
} from "@/features/admin-auth/model/permissions";

type RoleContextValue = {
  can: (permission: Permission) => boolean;
  permissions: Permission[];
  role: AccessRole;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({
  children,
  role,
}: {
  children: ReactNode;
  role: AccessRole;
}) {
  const permissions = permissionsForRole(role);

  return (
    <RoleContext.Provider
      value={{
        can: (permission) => can(role, permission),
        permissions,
        role,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider");
  }

  return context;
}
