import { describe, expect, it } from "vitest";

import { inquirySubmissionSchema, propertyTypeValues } from "./schema";

const validInput = {
  company: "Harbor Hotel",
  email: "morgan@example.com",
  message: "Evaluate HVAC savings.",
  name: "Morgan Lee",
  phone: "",
  propertyType: "hospitality",
  website: "",
};

describe("inquirySubmissionSchema", () => {
  it("normalizes whitespace and lowercases email", () => {
    const result = inquirySubmissionSchema.parse({
      ...validInput,
      company: "  Harbor   Hotel ",
      email: " Morgan@Example.COM ",
      message: "  Evaluate   HVAC\n savings. ",
      name: " Morgan   Lee ",
    });

    expect(result).toMatchObject({
      company: "Harbor Hotel",
      email: "morgan@example.com",
      message: "Evaluate HVAC savings.",
      name: "Morgan Lee",
    });
  });

  it("accepts an omitted phone as null and international formatting", () => {
    expect(inquirySubmissionSchema.parse(validInput).phone).toBeNull();
    expect(
      inquirySubmissionSchema.parse({
        ...validInput,
        phone: "+886 (2) 5550-1234 ext. 9",
      }).phone,
    ).toBe("+886 (2) 5550-1234 ext. 9");
  });

  it.each(propertyTypeValues)(
    "accepts the stable property type %s",
    (value) => {
      expect(
        inquirySubmissionSchema.safeParse({
          ...validInput,
          propertyType: value,
        }).success,
      ).toBe(true);
    },
  );

  it("rejects boundary violations and unknown fields", () => {
    expect(
      inquirySubmissionSchema.safeParse({
        ...validInput,
        name: "x".repeat(101),
      }).success,
    ).toBe(false);
    expect(
      inquirySubmissionSchema.safeParse({ ...validInput, message: "too short" })
        .success,
    ).toBe(false);
    expect(
      inquirySubmissionSchema.safeParse({ ...validInput, extra: "not allowed" })
        .success,
    ).toBe(false);
  });

  it("retains a populated honeypot for the handler to detect", () => {
    expect(
      inquirySubmissionSchema.parse({ ...validInput, website: "spam.example" })
        .website,
    ).toBe("spam.example");
  });
});
