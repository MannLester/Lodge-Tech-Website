import { describe, expect, it } from "vitest";

import {
  can,
  isAccessRole,
  permissionsForRole,
} from "@/features/admin-auth/model/permissions";

describe("CRM role permissions", () => {
  it("keeps operational users inside CRM work", () => {
    expect(can("USER", "crm.read")).toBe(true);
    expect(can("USER", "crm.write")).toBe(true);
    expect(can("USER", "reports.read")).toBe(false);
    expect(can("USER", "access.manage")).toBe(false);
    expect(can("USER", "audit.read")).toBe(false);
  });

  it("allows managers to read reports without access administration", () => {
    expect(can("MANAGER", "reports.read")).toBe(true);
    expect(can("MANAGER", "access.manage")).toBe(false);
    expect(can("MANAGER", "audit.read")).toBe(false);
  });

  it("allows admins to manage access and audit history", () => {
    expect(permissionsForRole("ADMIN")).toEqual([
      "crm.read",
      "crm.write",
      "reports.read",
      "access.manage",
      "audit.read",
    ]);
  });

  it("validates known access roles", () => {
    expect(isAccessRole("USER")).toBe(true);
    expect(isAccessRole("admin")).toBe(false);
  });
});
