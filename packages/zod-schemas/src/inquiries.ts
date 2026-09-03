import { z } from "zod";

export const PROPERTY_TYPES = [
  { label: "Hospitality", value: "hospitality" },
  { label: "Multifamily", value: "multifamily" },
  { label: "Senior living", value: "senior-living" },
  { label: "Student housing", value: "student-housing" },
  { label: "Commercial or office", value: "commercial-office" },
] as const;

export const propertyTypeValues = PROPERTY_TYPES.map((type) => type.value) as [
  (typeof PROPERTY_TYPES)[number]["value"],
  ...(typeof PROPERTY_TYPES)[number]["value"][],
];

function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizedText(options: {
  max: number;
  min: number;
  requiredMessage: string;
  tooLongMessage: string;
  tooShortMessage?: string;
}) {
  return z
    .string({ error: options.requiredMessage })
    .transform(normalizeWhitespace)
    .pipe(
      z
        .string()
        .min(options.min, options.tooShortMessage ?? options.requiredMessage)
        .max(options.max, options.tooLongMessage),
    );
}

export const inquirySubmissionSchema = z
  .object({
    company: normalizedText({
      max: 150,
      min: 1,
      requiredMessage: "Enter your property or company.",
      tooLongMessage: "Keep the property or company under 150 characters.",
    }),
    email: z
      .string({ error: "Enter your email." })
      .transform((value) => normalizeWhitespace(value).toLowerCase())
      .pipe(
        z
          .string()
          .min(1, "Enter your email.")
          .pipe(
            z
              .email("Enter a valid email address.")
              .max(254, "Keep the email under 254 characters."),
          ),
      ),
    message: normalizedText({
      max: 5000,
      min: 12,
      requiredMessage: "Tell us a little about the project.",
      tooLongMessage: "Keep the project notes under 5,000 characters.",
      tooShortMessage: "Tell us a little about the project.",
    }),
    name: normalizedText({
      max: 100,
      min: 1,
      requiredMessage: "Enter your name.",
      tooLongMessage: "Keep your name under 100 characters.",
    }),
    phone: z
      .string({ error: "Enter a valid phone number." })
      .transform(normalizeWhitespace)
      .refine(
        (value) => value.length === 0 || value.length >= 5,
        "Enter a valid phone number.",
      )
      .refine(
        (value) => value.length <= 40,
        "Keep the phone number under 40 characters.",
      )
      .transform((value) => value || null),
    propertyType: z.enum(propertyTypeValues, {
      error: "Select a property type.",
    }),
    website: z
      .string({ error: "Invalid submission." })
      .max(200, "Invalid submission.")
      .optional()
      .default("")
      .transform((value) => value.trim()),
  })
  .strict();

export type InquirySubmission = z.infer<typeof inquirySubmissionSchema>;
export type InquirySubmissionInput = z.input<typeof inquirySubmissionSchema>;
export type InquiryField = keyof InquirySubmissionInput;

export function getInquiryFieldErrors(error: z.ZodError) {
  const fieldErrors: Partial<Record<InquiryField | "_form", string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    const key =
      typeof field === "string" && field in inquirySubmissionSchema.shape
        ? (field as InquiryField)
        : "_form";

    fieldErrors[key] ??= issue.message;
  }

  return fieldErrors;
}
