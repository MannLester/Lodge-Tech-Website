"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  findAdminAccountByEmail,
  updateAdminAccountByEmail,
} from "@/features/admin-account/data/admin-account-repository";
import {
  adminAvatarTypes,
  adminProfileSchema,
  maxAdminAvatarBytes,
} from "@/features/admin-account/model/admin-account";
import { requireAdminSession } from "@/features/admin-auth";
import { getServerSupabaseClient } from "@/shared/supabase/server";

const avatarBucket = "admin-avatars";

function accountRedirect(status: string): never {
  redirect(`/admin?view=account&account_status=${status}`);
}

export async function updateAdminProfile(formData: FormData): Promise<void> {
  const session = await requireAdminSession();
  const result = adminProfileSchema.safeParse({
    displayName: formData.get("display_name"),
    jobTitle: formData.get("job_title"),
    phone: formData.get("phone"),
  });

  if (!result.success) accountRedirect("invalid-profile");

  const { error } = await updateAdminAccountByEmail(session.email, {
    display_name: result.data.displayName,
    job_title: result.data.jobTitle || null,
    phone: result.data.phone || null,
  });

  if (error) {
    console.error("Failed to update admin profile", error);
    accountRedirect("save-failed");
  }

  revalidatePath("/admin");
  accountRedirect("profile-saved");
}

export async function uploadAdminAvatar(formData: FormData): Promise<void> {
  const session = await requireAdminSession();
  const photo = formData.get("photo");

  if (!(photo instanceof File) || photo.size === 0) {
    accountRedirect("photo-required");
  }

  const extension =
    adminAvatarTypes[photo.type as keyof typeof adminAvatarTypes];
  if (!extension || photo.size > maxAdminAvatarBytes) {
    accountRedirect("invalid-photo");
  }

  const { data: current } = await findAdminAccountByEmail(session.email);
  const safeUserId = session.sub.replace(/[^a-zA-Z0-9-]/g, "");
  const nextPath = `${safeUserId}/profile.${extension}`;
  const supabase = getServerSupabaseClient();
  const { error: uploadError } = await supabase.storage
    .from(avatarBucket)
    .upload(nextPath, await photo.arrayBuffer(), {
      cacheControl: "3600",
      contentType: photo.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("Failed to upload admin avatar", uploadError);
    accountRedirect("photo-failed");
  }

  const { error: updateError } = await updateAdminAccountByEmail(
    session.email,
    { avatar_path: nextPath },
  );

  if (updateError) {
    if (current?.avatar_path !== nextPath) {
      await supabase.storage.from(avatarBucket).remove([nextPath]);
    }
    console.error("Failed to save admin avatar", updateError);
    accountRedirect("photo-failed");
  }

  if (current?.avatar_path && current.avatar_path !== nextPath) {
    const { error: cleanupError } = await supabase.storage
      .from(avatarBucket)
      .remove([current.avatar_path]);
    if (cleanupError)
      console.error("Failed to remove old avatar", cleanupError);
  }

  revalidatePath("/admin");
  accountRedirect("photo-saved");
}

export async function removeAdminAvatar(): Promise<void> {
  const session = await requireAdminSession();
  const { data: current } = await findAdminAccountByEmail(session.email);

  const { error } = await updateAdminAccountByEmail(session.email, {
    avatar_path: null,
  });
  if (error) {
    console.error("Failed to clear admin avatar", error);
    accountRedirect("photo-failed");
  }

  if (current?.avatar_path) {
    const { error: cleanupError } = await getServerSupabaseClient()
      .storage.from(avatarBucket)
      .remove([current.avatar_path]);
    if (cleanupError) {
      console.error("Failed to remove old admin avatar", cleanupError);
    }
  }

  revalidatePath("/admin");
  accountRedirect("photo-removed");
}
