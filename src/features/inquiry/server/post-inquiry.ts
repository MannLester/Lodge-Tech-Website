import "server-only";

import {
  getInquiryFieldErrors,
  inquirySubmissionSchema,
} from "@/shared/inquiries/schema";

import {
  supabaseInquiryRepository,
  type InquiryRepository,
} from "../data/inquiry-repository";

const MAX_PAYLOAD_BYTES = 16 * 1024;

function json(body: unknown, status: number) {
  return Response.json(body, {
    headers: { "Cache-Control": "no-store" },
    status,
  });
}

function hasAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function readJsonBody(request: Request) {
  const declaredLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(declaredLength) && declaredLength > MAX_PAYLOAD_BYTES) {
    return { kind: "too-large" } as const;
  }

  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > MAX_PAYLOAD_BYTES) {
        await reader.cancel();
        return { kind: "too-large" } as const;
      }

      chunks.push(value);
    }
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return {
      kind: "ok",
      value: JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      ),
    } as const;
  } catch {
    return { kind: "malformed" } as const;
  }
}

export function createPostInquiryHandler(
  repository: InquiryRepository = supabaseInquiryRepository,
) {
  return async function POST(request: Request) {
    if (!hasAllowedOrigin(request)) {
      return json({ ok: false, code: "ORIGIN_FORBIDDEN" }, 403);
    }

    const mediaType = request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase();

    if (mediaType !== "application/json") {
      return json({ ok: false, code: "UNSUPPORTED_MEDIA_TYPE" }, 415);
    }

    const body = await readJsonBody(request);

    if (body.kind === "too-large") {
      return json({ ok: false, code: "PAYLOAD_TOO_LARGE" }, 413);
    }

    if (body.kind === "malformed") {
      return json(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          fieldErrors: { _form: "Submit valid JSON." },
        },
        400,
      );
    }

    const parsed = inquirySubmissionSchema.safeParse(body.value);

    if (!parsed.success) {
      return json(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          fieldErrors: getInquiryFieldErrors(parsed.error),
        },
        400,
      );
    }

    if (parsed.data.website) {
      return json({ ok: true }, 201);
    }

    const inquiry = {
      company: parsed.data.company,
      email: parsed.data.email,
      message: parsed.data.message,
      name: parsed.data.name,
      phone: parsed.data.phone,
      propertyType: parsed.data.propertyType,
    };

    try {
      await repository.create(inquiry);
      return json({ ok: true }, 201);
    } catch (error) {
      console.error("Inquiry persistence failed", error);
      return json({ ok: false, code: "SUBMISSION_FAILED" }, 500);
    }
  };
}
