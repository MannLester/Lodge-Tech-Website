// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { POST } from "./route";

const proposal = {
  firstName: "Morgan",
  lastName: "Lee",
  email: "morgan@example.com",
  phone: "555-123-4567",
  propertyName: "Harbor Hotel",
  street: "1 Main St",
  addressLine2: "",
  city: "Boston",
  region: "MA",
  postalCode: "02110",
  country: "US",
  totalRooms: null,
  standardRooms: null,
  suiteCount: null,
  suites: [],
  entry: "interior",
  balcony: "none",
  balconyCount: null,
  hvacType: "",
  hvacBrand: "",
  hvacModels: [],
  guestControl: "wall",
  utilityCompany: "",
  products: [],
  notes: "",
  website: "",
};

function request(data: unknown, origin = "https://example.com") {
  const form = new FormData();
  form.set("proposal", JSON.stringify(data));
  return new Request("https://example.com/api/proposals", {
    method: "POST",
    headers: { origin },
    body: form,
  });
}

describe("POST /api/proposals", () => {
  it("rejects cross-origin requests", async () => {
    expect(
      (await POST(request(proposal, "https://other.example"))).status,
    ).toBe(403);
  });

  it("validates required proposal fields before persistence", async () => {
    const response = await POST(request({ ...proposal, email: "invalid" }));
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("VALIDATION_ERROR");
  });

  it("silently accepts honeypot entries without saving data", async () => {
    expect(
      (await POST(request({ ...proposal, website: "spam.example" }))).status,
    ).toBe(201);
  });

  it("rejects unsupported file content", async () => {
    const form = new FormData();
    form.set("proposal", JSON.stringify(proposal));
    form.set(
      "files",
      new File(["not an image"], "fake.png", { type: "image/png" }),
    );
    const response = await POST(
      new Request("https://example.com/api/proposals", {
        method: "POST",
        headers: { origin: "https://example.com" },
        body: form,
      }),
    );
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("INVALID_FILES");
  });
});
