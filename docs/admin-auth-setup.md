# Admin Google Authentication Setup and Handoff Guide

This guide explains how to configure the Lodge Tech admin dashboard in a new
Supabase account and a new Vercel account. It is written for the current
implementation in this repository, including the production issues already
encountered and the checks that prevent them from recurring.

Use this guide for each environment independently. Production and Preview
should not share a Supabase project, database, or privileged server key.

## What the application already implements

The application code already provides:

- a **Sign in with Google** action at `/admin`;
- a server-side PKCE callback at `/auth/callback`;
- flow-specific PKCE verifier IDs so concurrent or abandoned sign-in attempts
  do not overwrite one another;
- short retries for transport-level failures between Vercel and Supabase;
- server-validated Supabase users and cookie-backed sessions;
- a second authorization check against `public.admin_users`;
- forced Row Level Security on the allowlist table; and
- safe user-facing callback errors with detailed diagnostics retained in
  Vercel runtime logs.

Authentication and authorization are separate:

1. Google verifies the person's identity.
2. Supabase creates or retrieves the Auth user and issues the application
   session.
3. The application normalizes the email to lowercase.
4. The server checks for that email in `public.admin_users`.
5. Only a verified Google user with an allowlist match can see the dashboard.

An entry in `auth.users` does **not** grant dashboard access by itself. An entry
in `public.admin_users` also does not create a login session by itself. Both
conditions must be satisfied.

## Account ownership and prerequisites

The colleague taking ownership should have:

- access to Repo 1: `MannLester/Lodge-Tech-Website`;
- a Supabase organization and permission to create projects, manage Auth, run
  SQL, and view API keys;
- a Google Cloud project and permission to configure Google Auth Platform;
- a Vercel account or team and permission to manage the project, environment
  variables, deployments, domains, and runtime logs;
- Node.js and the package-manager version declared in `package.json`;
- the Supabase CLI and Vercel CLI, either installed or run through `pnpm dlx`;
  and
- Docker Desktop if local database tests will be run.

Before starting, decide the canonical origins. For example:

| Environment    | Application origin                                    | Supabase project            |
| -------------- | ----------------------------------------------------- | --------------------------- |
| Local          | `http://localhost:3000`                               | Preview/development project |
| Vercel Preview | A stable Preview or branch alias                      | Preview project             |
| Production     | `https://example.com` or the production Vercel domain | Production project          |

Do not alternate project references within one environment. The browser-safe
Supabase URL/key pair and the server Supabase URL/key pair must identify the
same project.

## 1. Create the Supabase projects

Create one Supabase project for Production and a separate one for Preview and
local integration testing. Record each 20-character project reference from the
project URL:

```text
https://<project-ref>.supabase.co
```

In each Supabase project, obtain these values from **Project Settings > API**:

| Application variable                   | Supabase value                                   | Exposure                  |
| -------------------------------------- | ------------------------------------------------ | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Project URL                                      | Browser-safe              |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key beginning with `sb_publishable_` | Browser-safe              |
| `SUPABASE_URL`                         | The same Project URL                             | Server-only by convention |
| `SUPABASE_SECRET_KEY`                  | Secret key beginning with `sb_secret_`           | Strictly server-only      |

The application also accepts the legacy `SUPABASE_SERVICE_ROLE_KEY` when a new
secret key is unavailable. Prefer `SUPABASE_SECRET_KEY`. Never place either
privileged key in a variable beginning with `NEXT_PUBLIC_`.

When retrieving keys with the Supabase CLI, secret keys may be masked unless
the command is run with its explicit reveal option. Never copy a row of masking
characters into Vercel. Use the Supabase dashboard or the authenticated CLI's
`--reveal` option on a trusted workstation, and verify the expected key prefix
without printing the complete value.

Official references:

- [Supabase Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase server-side Auth](https://supabase.com/docs/guides/auth/server-side)

## 2. Apply the database migrations

Run these commands from the repository root. Authenticate with the Supabase
account that owns the target project:

```powershell
pnpm exec supabase login
pnpm exec supabase link --project-ref <project-ref>
pnpm exec supabase db push --dry-run
pnpm exec supabase db push
```

Before either `db push` command, verify that the CLI is linked to the intended
project:

```powershell
pnpm exec supabase projects list
Get-Content supabase/.temp/project-ref
```

The linked marker and the local project-reference file must both match the
target project's 20-character reference. If they do not, stop and run
`supabase link` again with the correct reference. Repeat this check whenever
switching between Preview and Production; migrations and allowlist entries in
the wrong project will not affect the deployed application.

Always inspect the dry-run result before applying it. `db push` records applied
migrations and skips them on later runs. Do not use `db reset --linked` against
Production; that command destroys and rebuilds the linked remote database.

The migration
`supabase/migrations/20260906000000_create_admin_users.sql` creates the admin
allowlist. It intentionally:

- requires lowercase, syntactically valid email addresses;
- enables and forces Row Level Security;
- removes all table access from `anon` and `authenticated`; and
- grants access only to Supabase's privileged `service_role`.

This design prevents a signed-in browser user from reading the administrator
list. The Next.js server performs the lookup using its server-only key.

See the official [Supabase database migration workflow](https://supabase.com/docs/guides/deployment/database-migrations).

## 3. Configure Google Auth Platform

In Google Cloud, open **Google Auth Platform** for the client-owned project.

### Branding and audience

1. Configure the application name, support email, and authorized domains.
2. Choose the correct audience. If the app remains in Testing, add every admin
   Google account as a test user.
3. Configure the standard scopes required by Supabase:
   `openid`, `userinfo.email`, and `userinfo.profile`.
4. Publish or verify the application when the client's release policy requires
   it.

An admin who is not included in the Google testing audience may be rejected by
Google before Supabase or this application receives a code.

### OAuth client

Create an OAuth client with application type **Web application**.

Under **Authorized JavaScript origins**, add each application origin that may
start a Google login, without paths:

```text
http://localhost:3000
https://<production-domain>
https://<stable-preview-domain>
```

Under **Authorized redirect URIs**, add the Supabase Auth callback for each
Supabase project:

```text
https://<production-project-ref>.supabase.co/auth/v1/callback
https://<preview-project-ref>.supabase.co/auth/v1/callback
```

This is Google-to-Supabase routing. Do **not** put the application's
`/auth/callback` URL in Google's Authorized redirect URIs. Google returns to
Supabase first; Supabase then returns to the application.

Copy the Google Client ID and Client Secret. Treat the Client Secret as a
server credential and never commit it.

## 4. Enable Google in Supabase Auth

For each Supabase project:

1. Open **Authentication > Providers > Google**.
2. Enable Google.
3. Paste the Google Client ID and Client Secret.
4. Save the provider configuration.
5. Confirm that the callback displayed by Supabase exactly matches the URI
   registered in Google Cloud.

If Production and Preview use separate Google OAuth clients, configure each
Supabase project with its corresponding client. Separate clients provide
cleaner isolation and rotation.

## 5. Configure Supabase application redirect URLs

In each Supabase project, open **Authentication > URL Configuration**.

Set **Site URL** to that environment's canonical application origin:

```text
Production: https://<production-domain>
Preview:    https://<stable-preview-domain>
```

Add application callback URLs to **Redirect URLs**:

```text
http://localhost:3000/auth/callback**
https://<production-domain>/auth/callback**
https://<stable-preview-domain>/auth/callback**
```

The callback-specific `**` is intentional. The application appends a safe
`next` parameter and Supabase appends a unique `sb_flow_id` for PKCE verifier
correlation. Keep the scheme, host, and `/auth/callback` path exact; avoid a
broad Production wildcard such as `https://**`.

If every Vercel Preview deployment must support login, Supabase documents a
team-scoped pattern such as:

```text
https://*-<vercel-team-or-account-slug>.vercel.app/auth/callback**
```

Use wildcards for Preview only when necessary. Prefer a stable branch alias and
an exact host. See [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).

## 6. Add approved administrators

Open **SQL Editor** in the correct Supabase project and run:

```sql
insert into public.admin_users (email)
values (lower('admin@example.com'))
on conflict (email) do nothing;
```

Add one row per approved administrator. Google aliases and different domains
are different email strings; add exactly the address Google reports.

Verify the entry:

```sql
select email, created_at
from public.admin_users
where email = lower('admin@example.com');
```

To revoke dashboard access:

```sql
delete from public.admin_users
where email = lower('admin@example.com');
```

Revocation prevents the next protected read. To terminate an already issued
Supabase session immediately, also revoke that user's sessions from the
Supabase Authentication dashboard.

## 7. Configure Vercel

Import Repo 1 into the colleague's Vercel account or team and set `main` as the
Production branch. Configure Preview and Production variables separately.

### Required authentication variables

| Variable                               | Production value           | Preview value           |
| -------------------------------------- | -------------------------- | ----------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Production origin          | Stable Preview origin   |
| `NEXT_PUBLIC_SUPABASE_URL`             | Production Supabase URL    | Preview Supabase URL    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production publishable key | Preview publishable key |
| `SUPABASE_URL`                         | Production Supabase URL    | Preview Supabase URL    |
| `SUPABASE_SECRET_KEY`                  | Production secret key      | Preview secret key      |

`NEXT_PUBLIC_SITE_URL` must include `https://` in hosted environments and must
not end with an unrelated path. This repository currently reads that variable
directly when constructing the callback URL. A random Vercel Preview hostname
will not work unless the variable and Supabase allowlist both cover it.

The variables are also declared in `turbo.json`. Removing them from the Turbo
task environment can cause builds to omit values even when they exist in
Vercel.

Vercel applies changed environment variables only to new deployments. After
adding or replacing a value, redeploy Production or push a new commit to the
Production branch. See [Vercel environment variables](https://vercel.com/docs/environment-variables).

### Prevent invisible BOM characters

Never provision keys from a text file that may begin with a UTF-8 byte-order
mark (BOM). A BOM is invisible when viewed normally but is not legal in an HTTP
header.

Symptoms seen in production included:

```text
Cannot convert argument to a ByteString because the character ... has a value
of 65279 which is greater than 255.
```

`65279` is Unicode `U+FEFF`, the BOM character.

- Index `7` commonly points to a contaminated publishable key because the
  header starts with the seven characters `Bearer `.
- Index `0` commonly points to a contaminated server key used directly as an
  `apikey` header.

Copy values directly from the correct Supabase project's API settings or use
the authenticated CLIs. Do not use rich-text documents, email, word processors,
or BOM-encoded intermediary files.

Before setting values through PowerShell, validate them without printing the
secrets:

```powershell
function Assert-AsciiValue {
  param([string]$Name, [string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    throw "$Name is empty."
  }

  if ($Value -ne $Value.Trim()) {
    throw "$Name has leading or trailing whitespace. Copy it again from the provider."
  }

  $nonAscii = @($Value.ToCharArray() | Where-Object { [int]$_ -gt 127 })
  if ($nonAscii.Count -gt 0) {
    throw "$Name contains a non-ASCII character. Copy it again from the provider."
  }
}

Assert-AsciiValue "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" $publishableKey
Assert-AsciiValue "SUPABASE_SECRET_KEY" $secretKey
```

Expected formats provide an additional sanity check:

```powershell
if ($publishableKey -notmatch '^sb_publishable_') {
  throw 'Unexpected publishable-key format.'
}

if ($secretKey -notmatch '^sb_secret_') {
  throw 'Unexpected secret-key format.'
}
```

Do not print, log, or commit `$secretKey`. When CLI provisioning is used, run
it only on a trusted workstation. Example commands after the variables have
been populated and validated in memory:

```powershell
pnpm dlx vercel@latest env add NEXT_PUBLIC_SITE_URL production --value $siteUrl --force --no-sensitive --project <vercel-project> --yes
pnpm dlx vercel@latest env add NEXT_PUBLIC_SUPABASE_URL production --value $supabaseUrl --force --no-sensitive --project <vercel-project> --yes
pnpm dlx vercel@latest env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production --value $publishableKey --force --no-sensitive --project <vercel-project> --yes
pnpm dlx vercel@latest env add SUPABASE_URL production --value $supabaseUrl --force --no-sensitive --project <vercel-project> --yes
pnpm dlx vercel@latest env add SUPABASE_SECRET_KEY production --value $secretKey --force --sensitive --project <vercel-project> --yes
```

## 8. Local configuration

Copy `.env.example` to `.env.local` and use the Preview/development Supabase
project:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<preview-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_URL=https://<preview-project-ref>.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

`.env.local` is ignored by Git. Confirm that before adding any real key:

```powershell
git check-ignore .env.local
```

Start and verify the app:

```powershell
pnpm install --frozen-lockfile
pnpm run check
pnpm run build
pnpm run dev
```

Visit `http://localhost:3000/admin` and test with an email added to the Preview
allowlist.

## 9. Deploy and perform the end-to-end acceptance test

1. Run `pnpm run check` and `pnpm run build` locally or confirm the GitHub
   Actions checks pass.
2. Deploy to Vercel Production.
3. Confirm the deployment is **Ready** and the production alias points to it.
4. Close abandoned Google OAuth tabs. Each acceptance test should begin at the
   deployed `/admin` URL.
5. Click **Sign in with Google** once and choose an approved account.
6. Confirm the browser returns to `/admin` and renders the dashboard.
7. Refresh `/admin`; the dashboard should remain visible, proving the session
   cookie persisted.
8. Sign out; `/admin` should show the sign-in screen again.
9. Test one unapproved Google account; it should return to
   `/admin?auth=denied` and never render CRM data.

Verify the production records in Supabase SQL Editor:

```sql
select email, email_confirmed_at, last_sign_in_at
from auth.users
where lower(email) = lower('admin@example.com');

select email, created_at
from public.admin_users
where email = lower('admin@example.com');
```

A successful login should have a non-null `last_sign_in_at`. An Auth user with
`last_sign_in_at` still null has not completed the code-to-session exchange.

## 10. Troubleshooting map

Start with the URL and the Vercel runtime log for `/auth/callback`. Do not keep
asking a user to retry without inspecting the new log entry.

| Symptom                                                                                                   | Meaning                                                                | Checks and resolution                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google never opens                                                                                        | OAuth could not start                                                  | Validate all `NEXT_PUBLIC_*` values and confirm Google is enabled in the same Supabase project. Redeploy after changes.                                                                   |
| `/admin?auth=error&reason=missing_code`                                                                   | Google or Supabase returned without an authorization code              | Inspect `error` and `error_code` in Vercel logs. Check Google audience, provider credentials, and both redirect configurations.                                                           |
| `/admin?auth=error&reason=exchange_failed` with `AuthPKCECodeVerifierMissingError` or `bad_code_verifier` | The code and PKCE verifier do not match                                | Begin one new flow on the same browser/device. Confirm the deployed code includes `sb_flow_id` and a corresponding verifier cookie. Do not disable the flow-specific PKCE implementation. |
| `AuthRetryableFetchError`, status `0`, and a normal network message                                       | Vercel could not reach Supabase                                        | Check Supabase status and Vercel runtime logs. The callback retries thrown transport failures twice; persistent failures require provider/network investigation.                          |
| `AuthRetryableFetchError` with ByteString and character `65279` at index `7`                              | BOM at the start of the publishable key                                | Replace `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` directly from the correct Supabase project, validate ASCII, and redeploy.                                                                  |
| `This Google account is not approved` plus ByteString character `65279` at index `0` in the allowlist log | BOM at the start of the server key                                     | Replace `SUPABASE_SECRET_KEY`, validate ASCII, and redeploy.                                                                                                                              |
| `This Google account is not approved` with no allowlist query error                                       | Authentication succeeded but authorization failed                      | Add the normalized email to `public.admin_users` in the same Supabase project used by Vercel.                                                                                             |
| Auth user exists but the dashboard still asks for sign-in                                                 | A database identity record exists without a usable application session | Inspect `last_sign_in_at`, callback logs, callback cookies, and the code exchange. Do not interpret `auth.users` existence as an active login.                                            |
| Preview signs in but Production fails, or vice versa                                                      | Environment/project mismatch                                           | Compare the project reference in all four Supabase variables, Google callbacks, Supabase URL Configuration, and the active Vercel environment.                                            |
| A changed Vercel value appears ignored                                                                    | Existing deployment still contains the prior environment               | Redeploy. `NEXT_PUBLIC_*` values must be present during the new build.                                                                                                                    |
| User is redirected to an unexpected domain                                                                | Incorrect `NEXT_PUBLIC_SITE_URL` or Supabase Site URL                  | Set both to the intended canonical environment origin and allow its callback URL.                                                                                                         |

Retrieve recent callback logs with an authenticated Vercel CLI:

```powershell
pnpm dlx vercel@latest logs --project <vercel-project> --environment production --since 30m --query "Admin OAuth" --expand --limit 30 --no-branch

pnpm dlx vercel@latest logs --project <vercel-project> --environment production --since 30m --query "admin allowlist" --expand --limit 30 --no-branch
```

Runtime logs may include administrator email addresses or provider diagnostics.
Share them only through approved channels and redact secrets before copying
them into an issue.

## 11. Security and maintenance

- Keep Production and Preview credentials separate.
- Never commit `.env.local`, downloaded Vercel environments, Google Client
  Secrets, Supabase secret keys, access tokens, or database passwords.
- Never expose `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` to browser
  code.
- Keep `public.admin_users` inaccessible to `anon` and `authenticated`.
- Grant access by email allowlist, not by display name, job title, or client
  metadata.
- Use lowercase emails in the allowlist.
- Remove former administrators promptly and revoke their existing sessions.
- Rotate Google and Supabase secrets after ownership changes or suspected
  exposure, update Vercel, and redeploy.
- Review Vercel runtime logs after Auth dependency upgrades.
- Retain the PKCE flow-ID tests and callback diagnostics.
- Re-run the full approved/unapproved-account acceptance test after changing
  domains, Supabase projects, OAuth clients, or Vercel accounts.

## Final handoff checklist

- [ ] Production and Preview Supabase projects are client-owned and distinct.
- [ ] All migrations have been applied to both intended projects.
- [ ] Google OAuth clients use the correct Supabase callback URIs.
- [ ] Google audience/test users include every intended administrator.
- [ ] Google is enabled in both Supabase projects with the correct credentials.
- [ ] Supabase Site URL and application Redirect URLs are correct.
- [ ] Every approved email exists in that environment's `public.admin_users`.
- [ ] Each Vercel environment uses one consistent Supabase project reference.
- [ ] All environment values passed ASCII/BOM validation.
- [ ] Privileged keys are stored as Vercel Secrets and never exposed publicly.
- [ ] Production was redeployed after environment changes.
- [ ] GitHub checks and the Production build passed.
- [ ] Approved-account login, refresh, and logout passed.
- [ ] Unapproved-account denial passed.
- [ ] The colleague knows where to inspect Vercel callback logs and Supabase
      Auth/database records.
