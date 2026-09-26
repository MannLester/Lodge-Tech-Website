import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
const count = z.coerce.number().int().min(0).max(100000).nullable();

export const proposalSchema = z
  .object({
    firstName: text(80).min(1),
    lastName: text(80).min(1),
    email: z.email().max(254),
    phone: text(40).min(5),
    propertyName: text(150).min(1),
    street: text(160).min(1),
    addressLine2: text(160),
    city: text(100).min(1),
    region: text(100).min(1),
    postalCode: text(30).min(1),
    country: text(100).min(1),
    totalRooms: count,
    standardRooms: count,
    suiteCount: count,
    suites: z
      .array(
        z.object({ type: text(160).min(1), hvacUnits: count, quantity: count }),
      )
      .max(20),
    entry: z.enum(["exterior", "interior", "both"]),
    balcony: z.enum(["none", "sliding", "swinging"]),
    balconyCount: count,
    hvacType: text(120),
    hvacBrand: text(120),
    hvacModels: z.array(text(120).min(1)).max(20),
    guestControl: z.enum(["wall", "unit", "both", "other"]),
    utilityCompany: text(150),
    products: z.array(z.enum(["gem-link-wireless", "gem-stat-et"])).max(2),
    notes: text(5000),
    website: text(200),
  })
  .superRefine((proposal, context) => {
    if ((proposal.suiteCount ?? 0) > 0 && proposal.suites.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["suites"],
        message: "Add at least one suite type when suites are present.",
      });
    }
  });

export type ProposalInput = z.infer<typeof proposalSchema>;
