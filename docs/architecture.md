# Application Architecture

## Route composition

`apps/web/src/app` owns Next.js routes, layouts, metadata entry points, and Route Handlers. Route files should stay small and compose feature slices rather than contain substantial business or presentation logic.

## Feature slices

`apps/web/src/features/<feature>` owns one user-facing capability. A slice may contain only the folders it needs:

- `ui` for feature-specific React components.
- `model` for types, schemas, and state transitions.
- `server` for server-only orchestration.
- `data` for persistence and provider adapters.
- `test` for tests that exercise the complete slice.

Planned slices include the public home experience, inquiry intake, administrator authentication, and inquiry management. A feature may import from app-local shared modules or workspace packages, but feature slices must not reach into one another's internal folders.

## Shared code

`apps/web/src/shared` owns web-app-specific shared code, including site configuration and provider clients. Cross-package contracts live in `packages/*`: reusable UI in `@lodging-technologies/ui`, shared Zod contracts in `@lodging-technologies/zod-schemas`, and generated/shared types in `@lodging-technologies/types`.

## Dependency direction

```text
apps/web/src/app -> apps/web/src/features -> apps/web/src/shared
apps/web -> packages/*
```

Keep provider-specific code behind the feature or shared module that owns the contract. Keep secrets and server-only imports out of client component dependency graphs.

## Inquiry intake

The home form and `POST /api/inquiries` share the Zod contract in `@lodging-technologies/zod-schemas/inquiries`. The Route Handler delegates persistence to the inquiry repository, which is the only feature module that uses the server-only Supabase client. Browser code never connects to Supabase directly.

Supabase migrations are versioned in `supabase/migrations`. The inquiries table has forced Row Level Security and grants no table access to `anon` or `authenticated`; the server-held service role performs intake inserts.

## Administrator access

`apps/web/src/features/admin-auth` owns the temporary `/admin` demo administrator access gate. The route reads the signed session in the page component, renders a sign-in screen when no valid cookie is present, and renders an authenticated placeholder when the session verifies. Session cookie writes are limited to Server Actions, and future CRM data operations should re-check the admin session close to the mutation or query they protect.
