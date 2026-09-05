# Environment Configuration

Copy `.env.example` to `.env.local` for local development and replace every Supabase placeholder with credentials from the project owner. Local environment files are ignored by Git.

## Variables

- `NEXT_PUBLIC_SITE_URL` is the canonical origin for the current environment. It is safe to expose to browser code.
- `SUPABASE_URL` identifies the approved Supabase project.
- `SUPABASE_SERVICE_ROLE_KEY` is a privileged server credential. Never expose it through a `NEXT_PUBLIC_` variable or import server environment configuration into a client component.
- `SESSION_SECRET` signs temporary administrator sessions for `/admin`. Use a unique, random value of at least 32 characters for each environment.
- `VERCEL_ANALYTICS_TOKEN` is a server-only Vercel access token used to read Web Analytics in the CRM Reports view.
- `VERCEL_PROJECT_ID` identifies the Vercel project whose production homepage traffic is reported.
- `VERCEL_TEAM_ID` identifies the owning Vercel team. It can be omitted for a personal project.

Configure the same names separately in Vercel Preview and Production. Do not reuse production secrets in local or preview environments.

Enable Web Analytics for the Vercel project before deploying. Visitor collection starts after the deployment containing `@vercel/analytics`; older data is limited by the project plan's retention window. The Reports page remains usable when analytics configuration is absent, but visitor and inquiry-conversion values are shown as unavailable.

The public form does not use a Supabase anonymous key. It posts to the same-origin Next.js route, and only that server route can access the service-role credential.

Environment values are validated only when a feature requests them, allowing the frontend foundation to build before Supabase access is supplied. A feature that depends on missing or invalid configuration fails immediately instead of continuing with partial configuration.

The current `/admin` route includes a demo-only administrator bypass for CRM development. It is not a production authentication layer; Google sign-in and administrator allowlisting are planned as a later replacement.
