# Environment Configuration

Copy `.env.example` to `.env.local` for local development and replace every Supabase placeholder with credentials from the project owner. Local environment files are ignored by Git.

## Variables

- `NEXT_PUBLIC_SITE_URL` is the canonical origin for the current environment. It is safe to expose to browser code.
- `SUPABASE_URL` identifies the approved Supabase project.
- `SUPABASE_SERVICE_ROLE_KEY` is a privileged server credential. Never expose it through a `NEXT_PUBLIC_` variable or import server environment configuration into a client component.
- `SESSION_SECRET` signs temporary administrator sessions for `/admin`. Use a unique, random value of at least 32 characters for each environment.

Configure the same names separately in Vercel Preview and Production. Do not reuse production secrets in local or preview environments.

The public form does not use a Supabase anonymous key. It posts to the same-origin Next.js route, and only that server route can access the service-role credential.

Environment values are validated only when a feature requests them, allowing the frontend foundation to build before Supabase access is supplied. A feature that depends on missing or invalid configuration fails immediately instead of continuing with partial configuration.

The current `/admin` route includes a demo-only administrator bypass for CRM development. It is not a production authentication layer; Google sign-in and administrator allowlisting are planned as a later replacement.
