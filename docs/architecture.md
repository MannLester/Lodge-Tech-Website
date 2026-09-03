# Application Architecture

## Route composition

`src/app` owns Next.js routes, layouts, metadata entry points, and Route Handlers. Route files should stay small and compose feature slices rather than contain substantial business or presentation logic.

## Feature slices

`src/features/<feature>` owns one user-facing capability. A slice may contain only the folders it needs:

- `ui` for feature-specific React components.
- `model` for types, schemas, and state transitions.
- `server` for server-only orchestration.
- `data` for persistence and provider adapters.
- `test` for tests that exercise the complete slice.

Planned slices include the public home experience, inquiry intake, administrator authentication, and inquiry management. A feature may import from `src/shared`, but feature slices must not reach into one another's internal folders.

## Shared code

`src/shared` owns stable code used by multiple slices, including design-system components, site configuration, provider clients, and general utilities. Shared code must not import from `src/features` or `src/app`.

## Dependency direction

```text
src/app -> src/features -> src/shared
```

Keep provider-specific code behind the feature or shared module that owns the contract. Keep secrets and server-only imports out of client component dependency graphs.

## Inquiry intake

The home form and `POST /api/inquiries` share the Zod contract in `src/shared/inquiries`. The Route Handler delegates persistence to the inquiry repository, which is the only feature module that uses the server-only Supabase client. Browser code never connects to Supabase directly.

Supabase migrations are versioned in `supabase/migrations`. The inquiries table has forced Row Level Security and grants no table access to `anon` or `authenticated`; the server-held service role performs intake inserts.
