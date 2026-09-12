import { describe, expect, it } from "vitest";

import { readPkceFlowId } from "@/features/admin-auth/model/pkce-flow";

describe("readPkceFlowId", () => {
  it("accepts a valid flow identifier", () => {
    expect(readPkceFlowId("109b110013c7eb78f43968fd5f2a680b")).toBe(
      "109b110013c7eb78f43968fd5f2a680b",
    );
  });

  it("returns null when the flow identifier is missing", () => {
    expect(readPkceFlowId(null)).toBeNull();
  });

  it("rejects malformed flow identifiers", () => {
    expect(readPkceFlowId("short")).toBeNull();
    expect(readPkceFlowId("invalid flow identifier")).toBeNull();
  });
});
