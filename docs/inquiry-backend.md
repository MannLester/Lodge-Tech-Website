# Inquiry Backend Operations

## Runtime flow

The public form sends JSON to `POST /api/inquiries`. The endpoint requires a same-origin request and `application/json`, limits the body to 16 KiB, rejects fields outside the shared contract, and validates all values again on the server. A populated hidden `website` field is treated as spam and receives the normal success response without a database insert.

Successful requests return `201 { "ok": true }`. Validation failures return a stable `VALIDATION_ERROR` response with field messages. Origin, payload-size, and media-type failures use HTTP 403, 413, and 415. Persistence failures return only `500 { "ok": false, "code": "SUBMISSION_FAILED" }`; provider details are never sent to the browser.

## Supabase setup

Create the production project in a client-controlled Supabase organization and choose the closest available US East region. Use a separate non-production project for local integration and Preview deployments. Do not apply this migration to an unrelated existing project.

After authenticating the Supabase CLI and selecting the intended project:

```powershell
npx supabase link --project-ref <project-ref>
npx supabase db push
```

Set these values in `.env.local` for local development:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-secret>
```

Never commit `.env.local`, paste the service-role key into browser code, or prefix it with `NEXT_PUBLIC_`. Rotate the key immediately if it is exposed.

## Database verification

Docker Desktop must be running for the local Supabase test stack:

```powershell
npx supabase start
npm run db:test
```

The pgTAP suite verifies constraints, forced Row Level Security, and the absence of select, insert, update, or delete privileges for public roles. Stop the local stack with `npx supabase stop` after testing.

The Playwright persistence test runs only when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` point to a migrated test project. It submits through the Next.js route, reads the stored record, and deletes the verification record in cleanup.

## Vercel deployment

Connect the GitHub repository to a client-controlled Vercel project with `main` as the production branch. Configure `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` separately for Preview and Production. Preview should use non-production Supabase credentials.

Use the generated Vercel URL until custom-domain work is approved. Before retiring GitHub Pages, submit one uniquely identifiable test inquiry on both Preview and Production, verify each database row, delete the rows, and confirm the Production deployment is healthy. GitHub Actions now performs checks and a server build only; Vercel owns deployment.

## Troubleshooting

- HTTP 403 means the browser origin does not match the URL serving the endpoint.
- HTTP 413 means the encoded JSON body exceeded 16 KiB.
- HTTP 415 means the request did not use `application/json`.
- HTTP 500 usually indicates missing/invalid server environment values, an unapplied migration, or a Supabase connectivity problem. Inspect server logs; do not expose those details in the client response.
