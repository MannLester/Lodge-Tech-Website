import { describe, expect, it } from "vitest";
import { proposalSchema } from "./proposals";

const valid = {
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
  totalRooms: 90,
  standardRooms: 90,
  suiteCount: 0,
  suites: [],
  entry: "interior",
  balcony: "none",
  balconyCount: 0,
  hvacType: "PTAC",
  hvacBrand: "Brand",
  hvacModels: [],
  guestControl: "wall",
  utilityCompany: "",
  products: ["gem-link-wireless"],
  notes: "",
  website: "",
};

describe("proposalSchema", () => {
  it("accepts a complete proposal profile", () => {
    expect(proposalSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a suite description when suites are declared", () => {
    const parsed = proposalSchema.safeParse({ ...valid, suiteCount: 5 });
    expect(parsed.success).toBe(false);
    if (!parsed.success)
      expect(parsed.error.issues[0]?.path).toEqual(["suites"]);
  });

  it("rejects missing contact and property details", () => {
    expect(
      proposalSchema.safeParse({ ...valid, email: "invalid", street: "" })
        .success,
    ).toBe(false);
  });
});
