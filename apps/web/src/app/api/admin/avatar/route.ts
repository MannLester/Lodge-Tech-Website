import { readAdminSession } from "@/features/admin-auth";
import { loadAdminAccount } from "@/features/admin-account";
import { getServerSupabaseClient } from "@/shared/supabase/server";

export async function GET() {
  const session = await readAdminSession();
  if (!session) return new Response(null, { status: 401 });

  const { account } = await loadAdminAccount(session.email);
  if (!account.avatarPath) return new Response(null, { status: 404 });

  const { data, error } = await getServerSupabaseClient()
    .storage.from("admin-avatars")
    .download(account.avatarPath);

  if (error || !data) return new Response(null, { status: 404 });

  return new Response(data, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": data.type || "application/octet-stream",
    },
  });
}
