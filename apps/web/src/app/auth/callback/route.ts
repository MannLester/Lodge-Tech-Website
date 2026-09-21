import { NextResponse, type NextRequest } from "next/server";

import {
  auditRepository,
  createAdminSessionForAuthenticatedUser,
  createRetryingAuthFetch,
  readPkceFlowId,
  signOutAdmin,
} from "@/features/admin-auth";
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
  const flowId = readPkceFlowId(requestUrl.searchParams.get("sb_flow_id"));
  const next = safeAdminNextPath(requestUrl.searchParams.get("next"));

  // Destination evaluates to /admin/reset-password if passed via redirectTo
  const redirectUrl = new URL(next, requestUrl.origin);

  if (!code) {
    console.error("Admin Auth callback did not include an authorization code");
    redirectUrl.pathname = "/admin";
    redirectUrl.searchParams.set("auth", "error");
    redirectUrl.searchParams.set("reason", "missing_code");
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createSupabaseAuthServerClient({
    fetch: createRetryingAuthFetch(),
  });

  const { error } = await supabase.auth.exchangeCodeForSession(
    code,
    flowId ? { flowId } : undefined,
  );

  if (error) {
    console.error("Admin Auth code exchange failed", {
      code: error.code,
      message: error.message,
    });
    redirectUrl.pathname = "/admin";
    redirectUrl.search = "?auth=error&reason=exchange_failed";
    return NextResponse.redirect(redirectUrl);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const session = userError
    ? null
    : user
      ? await createAdminSessionForAuthenticatedUser(user)
      : null;

  if (!session) {
    await auditRepository.recordBestEffort(null, {
      action: "auth.login_denied",
      after: user?.email ? { email: user.email.toLowerCase() } : null,
      resourceType: "auth_session",
    });
    await signOutAdmin();
    redirectUrl.pathname = "/admin";
    redirectUrl.search = "?auth=denied";
    return NextResponse.redirect(redirectUrl);
  }

  await auditRepository.record(session, {
    action: "auth.login_succeeded",
    resourceId: session.crmUserId,
    resourceType: "crm_user",
  });

  return NextResponse.redirect(redirectUrl);
}
