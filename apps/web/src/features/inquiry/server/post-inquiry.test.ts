// @vitest-environment node

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

vi.mock("server-only", () => ({}));

import type { InquiryRepository } from "@/features/inquiry/data/inquiry-repository";

import { createPostInquiryHandler } from "@/features/inquiry/server/post-inquiry";

const validBody = {
  company: "  Harbor   Hotel ",
  email: " Morgan@Example.COM ",
  message: "Evaluate HVAC and lighting savings.",
  name: " Morgan Lee ",
  phone: "",
  propertyType: "hospitality",
  website: "",
};

function request(
  body: BodyInit = JSON.stringify(validBody),
  headers: HeadersInit = {},
) {
  return new Request("https://example.com/api/inquiries", {
    body,
    headers: {
      "Content-Type": "application/json",
      Origin: "https://example.com",
      ...headers,
    },
    method: "POST",
  });
}

describe("POST /api/inquiries", () => {
  let repository: InquiryRepository;
  let create: MockedFunction<InquiryRepository["create"]>;

  beforeEach(() => {
    create = vi.fn<InquiryRepository["create"]>().mockResolvedValue(undefined);
    repository = { create };
  });

  it("normalizes and persists a valid inquiry", async () => {
    const response = await createPostInquiryHandler(repository)(request());

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(create).toHaveBeenCalledWith({
      company: "Harbor Hotel",
      email: "morgan@example.com",
      message: "Evaluate HVAC and lighting savings.",
      name: "Morgan Lee",
      phone: null,
      propertyType: "hospitality",
    });
  });

  it("returns validation errors for malformed JSON and invalid fields", async () => {
    const handler = createPostInquiryHandler(repository);
    const malformed = await handler(request("{"));
    const invalid = await handler(
      request(JSON.stringify({ ...validBody, name: "", unexpected: true })),
    );

    expect(malformed.status).toBe(400);
    await expect(malformed.json()).resolves.toMatchObject({
      code: "VALIDATION_ERROR",
      fieldErrors: { _form: "Submit valid JSON." },
      ok: false,
    });
    expect(invalid.status).toBe(400);
    await expect(invalid.json()).resolves.toMatchObject({
      code: "VALIDATION_ERROR",
      ok: false,
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects oversized payloads", async () => {
    const response = await createPostInquiryHandler(repository)(
      request(JSON.stringify({ ...validBody, message: "x".repeat(17_000) })),
    );

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      code: "PAYLOAD_TOO_LARGE",
      ok: false,
    });
  });

  it("rejects missing or cross-origin requests", async () => {
    const handler = createPostInquiryHandler(repository);
    const missingOrigin = request();
    missingOrigin.headers.delete("origin");
    const missingResponse = await handler(missingOrigin);
    const crossOriginResponse = await handler(
      request(JSON.stringify(validBody), { Origin: "https://attacker.test" }),
    );

    expect(missingResponse.status).toBe(403);
    expect(crossOriginResponse.status).toBe(403);
    expect(create).not.toHaveBeenCalled();
  });

  it("accepts the public forwarded origin when the internal URL differs", async () => {
    const proxiedRequest = new Request("http://localhost:3000/api/inquiries", {
      body: JSON.stringify(validBody),
      headers: {
        "Content-Type": "application/json",
        Host: "localhost:3000",
        Origin: "https://preview.example.com",
        "X-Forwarded-Host": "preview.example.com",
        "X-Forwarded-Proto": "https",
      },
      method: "POST",
    });

    const response = await createPostInquiryHandler(repository)(proxiedRequest);

    expect(response.status).toBe(201);
    expect(create).toHaveBeenCalledOnce();
  });

  it("rejects non-JSON content", async () => {
    const response = await createPostInquiryHandler(repository)(
      request("plain text", { "Content-Type": "text/plain" }),
    );

    expect(response.status).toBe(415);
    expect(create).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without persisting", async () => {
    const response = await createPostInquiryHandler(repository)(
      request(JSON.stringify({ ...validBody, website: "spam.example" })),
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(create).not.toHaveBeenCalled();
  });

  it("sanitizes repository failures", async () => {
    create.mockRejectedValue(new Error("database secret details"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await createPostInquiryHandler(repository)(request());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      code: "SUBMISSION_FAILED",
      ok: false,
    });
  });
});
