import { Camera, Save, Trash2, UserRound } from "lucide-react";

import {
  removeAdminAvatar,
  updateAdminProfile,
  uploadAdminAvatar,
} from "@/features/admin-account/server/actions";
import { AdminAvatar } from "@/features/admin-account/ui/admin-avatar";

import type { AdminAccountResult } from "@/features/admin-account/model/admin-account";

const messages: Record<string, { message: string; tone: "error" | "success" }> =
  {
    "invalid-photo": {
      message: "Choose a JPG, PNG, or WebP image no larger than 2 MB.",
      tone: "error",
    },
    "invalid-profile": {
      message: "Enter a display name and keep each field within its limit.",
      tone: "error",
    },
    "photo-failed": {
      message: "The profile photo could not be updated. Please try again.",
      tone: "error",
    },
    "photo-removed": {
      message: "Profile photo removed.",
      tone: "success",
    },
    "photo-required": {
      message: "Choose a profile photo before uploading.",
      tone: "error",
    },
    "photo-saved": {
      message: "Profile photo updated.",
      tone: "success",
    },
    "profile-saved": {
      message: "Account details updated.",
      tone: "success",
    },
    "save-failed": {
      message: "The account details could not be saved. Please try again.",
      tone: "error",
    },
  };

export function AdminAccountWorkspace({
  result,
  status,
}: {
  result: AdminAccountResult;
  status?: string;
}) {
  const { account } = result;
  const feedback = status ? messages[status] : undefined;

  return (
    <>
      <section className="border-border bg-surface rounded-lg border p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Admin account</p>
            <h1 className="mt-2 text-3xl font-bold">Profile settings</h1>
            <p className="text-muted mt-2 max-w-2xl text-sm leading-6">
              Manage the identity shown in the CRM and your profile photo.
            </p>
          </div>
          <UserRound aria-hidden="true" className="text-brand size-7" />
        </div>
        {feedback ? (
          <p
            aria-live="polite"
            className={`mt-5 rounded-md border px-4 py-3 text-sm ${
              feedback.tone === "success"
                ? "border-brand bg-brand-soft text-brand-strong"
                : "bg-surface-muted text-foreground border-red-400"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}
        {!result.ok ? (
          <p className="bg-surface-muted text-foreground mt-5 rounded-md border border-amber-400 px-4 py-3 text-sm">
            {result.message}
          </p>
        ) : null}
      </section>

      <div className="grid gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <section className="border-border bg-surface rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-bold">Profile photo</h2>
          <div className="mt-5 flex flex-col items-center text-center">
            <AdminAvatar account={account} size="large" />
            <p className="mt-3 font-bold">{account.displayName}</p>
            <p className="text-muted mt-1 text-sm">{account.email}</p>
          </div>
          <form action={uploadAdminAvatar} className="mt-6 grid gap-3">
            <label className="text-sm font-semibold" htmlFor="admin-photo">
              Upload a new photo
            </label>
            <input
              accept="image/jpeg,image/png,image/webp"
              className="border-border file:bg-brand-soft file:text-brand-strong w-full rounded-md border text-sm file:mr-3 file:border-0 file:px-3 file:py-2 file:font-bold"
              disabled={!result.ok}
              id="admin-photo"
              name="photo"
              required
              type="file"
            />
            <p className="text-muted text-xs">
              JPG, PNG, or WebP. Maximum 2 MB.
            </p>
            <button
              className="bg-brand hover:bg-brand-fill inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!result.ok}
              type="submit"
            >
              <Camera aria-hidden="true" className="size-4" />
              Upload photo
            </button>
          </form>
          {account.avatarPath ? (
            <form action={removeAdminAvatar} className="mt-3">
              <button
                className="border-border inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border px-4 text-sm font-bold hover:border-red-400 hover:text-red-700"
                type="submit"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Remove photo
              </button>
            </form>
          ) : null}
        </section>

        <section className="border-border bg-surface rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-bold">Account details</h2>
          <p className="text-muted mt-2 text-sm">
            Your email comes from Google and controls CRM access.
          </p>
          <form action={updateAdminProfile} className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-semibold">
              Display name
              <input
                className="border-border bg-surface rounded-md border px-3 py-2"
                defaultValue={account.displayName}
                disabled={!result.ok}
                maxLength={80}
                name="display_name"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <input
                className="border-border bg-surface-muted text-muted rounded-md border px-3 py-2"
                disabled
                value={account.email}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Job title
              <input
                className="border-border bg-surface rounded-md border px-3 py-2"
                defaultValue={account.jobTitle ?? ""}
                disabled={!result.ok}
                maxLength={100}
                name="job_title"
                placeholder="Operations Manager"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Phone
              <input
                className="border-border bg-surface rounded-md border px-3 py-2"
                defaultValue={account.phone ?? ""}
                disabled={!result.ok}
                maxLength={40}
                name="phone"
                placeholder="+1 555 0100"
                type="tel"
              />
            </label>
            <button
              className="bg-brand hover:bg-brand-fill inline-flex min-h-11 w-fit items-center gap-2 rounded-md px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!result.ok}
              type="submit"
            >
              <Save aria-hidden="true" className="size-4" />
              Save changes
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
