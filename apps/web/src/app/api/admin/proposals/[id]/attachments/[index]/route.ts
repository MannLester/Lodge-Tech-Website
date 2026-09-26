import { readAdminSession } from "@/features/admin-auth";
import { getServerSupabaseClient } from "@/shared/supabase/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string; index: string }> },
) {
  if (!(await readAdminSession())) return new Response(null, { status: 401 });
  const { id, index } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-2]$/.test(index))
    return new Response(null, { status: 404 });
  const client = getServerSupabaseClient();
  const { data: proposal, error } = await client
    .from("proposal_requests")
    .select("attachments")
    .eq("id", id)
    .maybeSingle();
  if (error || !proposal || !Array.isArray(proposal.attachments))
    return new Response(null, { status: 404 });
  const attachment = proposal.attachments[Number(index)];
  if (
    !attachment ||
    typeof attachment !== "object" ||
    Array.isArray(attachment) ||
    typeof attachment.path !== "string" ||
    typeof attachment.name !== "string" ||
    typeof attachment.mime !== "string"
  )
    return new Response(null, { status: 404 });
  if (!attachment.path.startsWith(`${id}/`))
    return new Response(null, { status: 404 });
  const { data, error: downloadError } = await client.storage
    .from("proposal-attachments")
    .download(attachment.path);
  if (downloadError || !data) return new Response(null, { status: 404 });
  const safeName = attachment.name.replace(/[\r\n"\\]/g, "_");
  return new Response(data, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": attachment.mime,
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
