# Environment Configuration

Copy `.env.example` to `.env.local` for local development and replace every Supabase placeholder with credentials from the project owner. Local environment files are ignored by Git.

## Variables

- `NEXT_PUBLIC_SITE_URL` is the canonical origin for the current environment. It is safe to expose to browser code.
- `SUPABASE_URL` identifies the approved Supabase project.
- `SUPABASE_ANON_KEY` is the browser-safe project key used with Row Level Security.
- `SUPABASE_SERVICE_ROLE_KEY` is a privileged server credential. Never expose it through a `NEXT_PUBLIC_` variable or import server environment configuration into a client component.

Configure the same names separately in Vercel Preview and Production. Do not reuse production secrets in local or preview environments.

Environment values are validated only when a feature requests them, allowing the frontend foundation to build before Supabase access is supplied. A feature that depends on missing or invalid configuration fails immediately instead of continuing with partial configuration.
