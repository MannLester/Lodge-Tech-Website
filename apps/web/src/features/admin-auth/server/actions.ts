"use server";

import { redirect } from "next/navigation";

import {
  createAdminSessionCookie,
  deleteAdminSessionCookie,
} from "@/features/admin-auth/server/session";

export async function loginAsDemoAdmin(): Promise<void> {
  await createAdminSessionCookie();
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await deleteAdminSessionCookie();
  redirect("/admin");
}
