"use server";

import { redirect } from "next/navigation";

import { createAdminSessionCookie, deleteAdminSessionCookie } from "./session";

export async function loginAsDemoAdmin(): Promise<void> {
  await createAdminSessionCookie();
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await deleteAdminSessionCookie();
  redirect("/admin");
}
