# Environment Configuration

For the complete Google OAuth, Supabase allowlist, Vercel deployment, and
troubleshooting handoff procedure, see
[`docs/admin-auth-setup.md`](./admin-auth-setup.md).

Copy `.env.example` to `.env.local` for local development and replace every Supabase placeholder with credentials from the project owner. Because the Next app runs from `apps/web`, keep the same local values available to that package as well. Local environment files are ignored by Git.

## Variables

- `NEXT_PUBLIC_SITE_URL` is the canonical origin for the current environment. It is safe to expose to browser code.
- `NEXT_PUBLIC_SUPABASE_URL` identifies the Supabase project used for browser auth.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the browser-safe Supabase key used to start Google OAuth and read the current auth session.
- `SUPABASE_URL` identifies the approved Supabase project.
- `SUPABASE_SECRET_KEY` is a privileged server credential used by server-only CRM access, audit, and lead queries. Never expose it through a `NEXT_PUBLIC_` variable or import server environment configuration into a client component.
- `VERCEL_ANALYTICS_TOKEN` is a server-only Vercel access token used to read Web Analytics in the CRM Reports view.
- `VERCEL_PROJECT_ID` identifies the Vercel project whose production homepage traffic is reported.
- `VERCEL_TEAM_ID` identifies the owning Vercel team. It can be omitted for a personal project.

Configure the same names separately in Vercel Preview and Production. Do not reuse production secrets in local or preview environments.

Enable Web Analytics for the Vercel project before deploying. Visitor collection starts after the deployment containing `@vercel/analytics`; older data is limited by the project plan's retention window. The Reports page remains usable when analytics configuration is absent, but visitor and inquiry-conversion values are shown as unavailable.

The public form does not use the browser Supabase client. It posts to the same-origin Next.js route, and only that server route can access the secret credential.

Environment values are validated only when a feature requests them, allowing the frontend foundation to build before Supabase access is supplied. A feature that depends on missing or invalid configuration fails immediately instead of continuing with partial configuration.

The `/admin` route uses Supabase Auth with Google OAuth. A signed-in Google user must also exist in `public.crm_users` with a non-disabled role before the CRM renders. `public.admin_users` is now a read-only compatibility view.
