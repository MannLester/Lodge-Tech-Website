"use server";

import { redirect } from "next/navigation";

import {
  isAllowedAdminEmail,
  signOutAdmin,
} from "@/features/admin-auth/server/session";
import { getOptionalPublicEnv } from "@/shared/config/env/public";
import { createOptionalSupabaseAuthServerClient } from "@/shared/supabase/auth";

const GENERIC_RESET_CONFIRMATION =
  "If that email is registered for CRM access, a reset link has been sent.";

export async function logoutAdmin(): Promise<void> {
  await signOutAdmin();
  redirect("/admin");
}

export async function signInWithEmailAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{ error?: string } | void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const isAllowed = await isAllowedAdminEmail(email);
  if (!isAllowed) {
    return {
      error:
        "That email address is not allowlisted for CRM access. Contact an administrator.",
    };
  }

  const supabase = await createOptionalSupabaseAuthServerClient();
  if (!supabase) {
    return { error: "Authentication service is currently unavailable." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/admin");
}

export async function requestPasswordResetAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{ error?: string; success?: string }> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  // Always return a generic message so we never reveal which emails are allowlisted
  const isAllowed = await isAllowedAdminEmail(email);
  if (!isAllowed) {
    return { success: GENERIC_RESET_CONFIRMATION };
  }

  const supabase = await createOptionalSupabaseAuthServerClient();
  if (!supabase) {
    return { error: "Authentication service is currently unavailable." };
  }

  const publicEnv = getOptionalPublicEnv();
  const redirectTo = publicEnv
    ? `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin/reset-password`
    : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    // TEMP: full error detail for local debugging, remove once email delivery is confirmed working
    console.error("Admin password reset request failed", {
      redirectTo,
      status: error.status,
      code: error.code,
      message: error.message,
      name: error.name,
    });
  } else if (process.env.NODE_ENV !== "production") {
    console.log("Admin password reset request sent to Supabase", {
      email,
      redirectTo,
    });
  }

  return { success: GENERIC_RESET_CONFIRMATION };
}

export async function updatePasswordAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{ error?: string } | void> {
  const password = formData.get("password") as string;

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  const supabase = await createOptionalSupabaseAuthServerClient();
  if (!supabase) {
    return { error: "Authentication service is currently unavailable." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !user.email) {
    return {
      error: "Invalid or expired session. Please request a new reset link.",
    };
  }

  const isAllowed = await isAllowedAdminEmail(user.email);
  if (!isAllowed) {
    return { error: "This email address is not authorized for CRM access." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}
