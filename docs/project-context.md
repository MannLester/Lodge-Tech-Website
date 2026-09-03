# Project Context

## Product goal

Build a conversion-focused B2B energy-management website for Lodging Technologies. The public landing page must explain measurable savings quickly, present the product hierarchy clearly, and direct qualified visitors to a working inquiry form. Authorized staff must be able to review and track those inquiries in a small private dashboard.

## Source precedence

When the supplied references differ, use this order:

1. `LODGING-TECHNOLOGIES-MASTER-WEBSITE-DESIGN-ARCHITECTURE-BLUEPRINT-V.2-1.pdf` defines the current approved page structure, content hierarchy, day/night theme contract, conversion goals, and visual direction.
2. `Lodging_Technologies_Approved_Website_Design_Blueprint_Presentation1.pdf` is historical context only where it does not conflict with V2.
3. `reference_image.jpg` guides composition, density, section rhythm, and target visual quality. It is not an approved source for unverified business claims or production-ready assets.
4. `Lodging-Technologies-Landing-Page-Proposal.pdf` defines scope boundaries, technical direction, delivery requirements, and the inquiry-management workflow.

Do not invent claims, case-study details, contact information, or client assets when the references do not provide an approved value.

## Approved visual direction

- V2 supersedes the old green-accent direction. Use a restrained monochrome foundation with navy structure and cyan action accents.
- The approved V2 blueprint defines required sections, content hierarchy, conversion goals, and Day/Night theme behavior.
- Low-resolution or non-photographic placeholders are acceptable during implementation when final logo, product, platform, property, or industry assets are unavailable.
- Placeholder media must reserve stable responsive dimensions so final assets can be substituted without restructuring the page.

## Approved public experience

- Responsive landing page for desktop, tablet, and mobile.
- Header navigation: Technology, Solutions, Industries, Results, and Company.
- Hero message: "Reduce HVAC, Lighting, and Appliance Energy Expense 40%."
- Primary conversion actions for a savings analysis and product demo.
- Proof statistics for experience, installations, energy expense reduction, and secured incentives.
- Value propositions: Reduce Energy, Lower Demand, Utility Incentives, Positive Cash Flow, and Turnkey Solutions.
- Product showcase: GEM Stat ET, GEM Link Wireless, Lighting Controls, and Appliance Controls.
- Cloud platform, industries, evidence-safe results, turnkey process, closing conversion banner, validated frontend inquiry form, and footer.
- Global Day/Night theme architecture.
- Basic metadata, accessibility, browser QA, and optimized media delivery.

## Approved inquiry workflow

This V2 alignment pass provides a frontend-only validated inquiry form with a clear success state. Backend persistence, Supabase storage, administrator routes, status tracking, and deployment plumbing remain deferred until those credentials and production decisions are supplied.

This is not a full CRM. Sales pipelines, automation, assignments, bulk messaging, analytics, external CRM synchronization, and multi-role administration are outside the approved scope.

## Technical baseline

- Next.js App Router with React and TypeScript.
- Tailwind CSS for the responsive design system.
- Zod for server-side input and environment validation when backend features are enabled.
- Next.js Route Handlers for inquiry intake and status changes are deferred.
- Supabase PostgreSQL, Supabase Auth, versioned SQL migrations, least-privilege grants, and Row Level Security are deferred.
- Vertical Slice Architecture grouping feature UI, validation, server logic, data access, and tests.
- Vitest for fast automated checks and Playwright for critical browser workflows.
- Vercel local, preview, and production environments.

The proposal calls this an initial baseline. Any provider or architecture change that materially affects scope, schedule, migration work, or cost requires approval before implementation.

## Decisions required before production launch

- Confirm whether the production primary CTA should remain "Get a Savings Analysis."
- Approve every public statistic and case-study claim before publication.
- Supply the final logo, approved product photography, industry photography, and platform imagery.
- Supply company copy, contact information, resource links, and any legal footer content.
- Confirm the exact inquiry fields, required fields, consent language, and intended post-submission response.

## Access required before integration and deployment

- Supabase project and administrator-account details.
- Vercel team and project access.
- Domain and DNS access for production launch.
- Authorized staging reviewers and one primary decision-maker.
