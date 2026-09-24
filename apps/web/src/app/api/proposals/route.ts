import { proposalSchema } from "@lodging-technologies/zod-schemas/proposals";

import { getServerSupabaseClient } from "@/shared/supabase/server";

const MAX_BODY = 4 * 1024 * 1024;
const MAX_FILE = 3 * 1024 * 1024;
const MAX_FILES = 3;
const BUCKET = "proposal-attachments";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const source = new URL(origin);
    const target = new URL(request.url);
    const host =
      request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      request.headers.get("host") ||
      target.host;
    const protocol =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
      target.protocol.slice(0, -1);
    return source.host === host && source.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}

async function boundedBody(request: Request) {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function verifiedFileType(bytes: Uint8Array) {
  if (
    bytes.length >= 5 &&
    String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-"
  )
    return { mime: "application/pdf", ext: "pdf" };
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return { mime: "image/jpeg", ext: "jpg" };
  if (
    bytes.length >= 8 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every(
      (part, index) => bytes[index] === part,
    )
  )
    return { mime: "image/png", ext: "png" };
  return null;
}

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json(
      { ok: false, code: "ORIGIN_FORBIDDEN" },
      { status: 403 },
    );
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("multipart/form-data;")
  )
    return Response.json(
      { ok: false, code: "UNSUPPORTED_MEDIA_TYPE" },
      { status: 415 },
    );
  const body = await boundedBody(request);
  if (!body)
    return Response.json(
      { ok: false, code: "PAYLOAD_TOO_LARGE" },
      { status: 413 },
    );
  let form: FormData;
  try {
    form = await new Response(body, {
      headers: { "content-type": request.headers.get("content-type")! },
    }).formData();
  } catch {
    return Response.json({ ok: false, code: "INVALID_FORM" }, { status: 400 });
  }
  const raw = form.get("proposal");
  if (typeof raw !== "string")
    return Response.json({ ok: false, code: "INVALID_FORM" }, { status: 400 });
  let parsed: ReturnType<typeof proposalSchema.safeParse>;
  try {
    parsed = proposalSchema.safeParse(JSON.parse(raw));
  } catch {
    return Response.json({ ok: false, code: "INVALID_FORM" }, { status: 400 });
  }
  if (!parsed.success)
    return Response.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  if (parsed.data.website) return Response.json({ ok: true }, { status: 201 });

  const files = form.getAll("files");
  if (
    files.length > MAX_FILES ||
    files.some((item) => !(item instanceof File) || item.size > MAX_FILE)
  )
    return Response.json({ ok: false, code: "INVALID_FILES" }, { status: 400 });
  const prepared: {
    name: string;
    bytes: Uint8Array;
    mime: string;
    ext: string;
  }[] = [];
  for (const item of files) {
    const file = item as File;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = verifiedFileType(bytes);
    if (!type || file.name.length > 180)
      return Response.json(
        { ok: false, code: "INVALID_FILES" },
        { status: 400 },
      );
    prepared.push({ name: file.name, bytes, ...type });
  }

  const id = crypto.randomUUID();
  const client = getServerSupabaseClient();
  const paths: string[] = [];
  const attachments: { name: string; path: string; mime: string }[] = [];
  try {
    for (const [index, file] of prepared.entries()) {
      const path = `${id}/${index}.${file.ext}`;
      const { error } = await client.storage
        .from(BUCKET)
        .upload(path, file.bytes, { contentType: file.mime, upsert: false });
      if (error) throw error;
      paths.push(path);
      attachments.push({ name: file.name, path, mime: file.mime });
    }
    const proposal = parsed.data;
    const { error } = await client.from("proposal_requests").insert({
      id,
      first_name: proposal.firstName,
      last_name: proposal.lastName,
      email: proposal.email,
      phone: proposal.phone,
      property_name: proposal.propertyName,
      details: proposal,
      attachments,
    });
    if (error) throw error;
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (paths.length) await client.storage.from(BUCKET).remove(paths);
    console.error("Proposal persistence failed", error);
    return Response.json(
      { ok: false, code: "SUBMISSION_FAILED" },
      { status: 500 },
    );
  }
}
