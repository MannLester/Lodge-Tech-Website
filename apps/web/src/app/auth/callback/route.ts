import { NextResponse, type NextRequest } from "next/server";

import { readAdminSession, signOutAdmin } from "@/features/admin-auth";
import { createSupabaseAuthServerClient } from "@/shared/supabase/auth";

function safeAdminNextPath(value: string | null): string {
  return value === "/admin" ||
    value?.startsWith("/admin/") ||
    value?.startsWith("/admin?")
    ? value
    : "/admin";
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeAdminNextPath(requestUrl.searchParams.get("next"));
  const redirectUrl = new URL(next, requestUrl.origin);

  if (!code) {
    redirectUrl.searchParams.set("auth", "error");
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createSupabaseAuthServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirectUrl.pathname = "/admin";
    redirectUrl.search = "?auth=error";
    return NextResponse.redirect(redirectUrl);
  }

  const session = await readAdminSession();

  if (!session) {
    await signOutAdmin();
    redirectUrl.pathname = "/admin";
    redirectUrl.search = "?auth=denied";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(redirectUrl);
}
