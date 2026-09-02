# Project Context

## Product goal

Build a conversion-focused B2B energy-management website for Lodging Technologies. The public landing page must explain measurable savings quickly, present the product hierarchy clearly, and direct qualified visitors to a working inquiry form. Authorized staff must be able to review and track those inquiries in a small private dashboard.

## Source precedence

When the supplied references differ, use this order:

1. `Lodging_Technologies_Approved_Website_Design_Blueprint_Presentation1.pdf` defines the approved page structure, content hierarchy, themes, and conversion goals.
2. `reference_image.jpg` guides composition, density, section rhythm, and target visual quality. It is not an approved source for unverified business claims or production-ready assets.
3. `Lodging-Technologies-Landing-Page-Proposal.pdf` defines scope boundaries, technical direction, delivery requirements, and the inquiry-management workflow.

Do not invent claims, case-study details, contact information, or client assets when the references do not provide an approved value.

## Approved public experience

- Responsive landing page for desktop, tablet, and mobile.
- Header navigation: Technology, Solutions, Industries, Results, and Company.
- Hero message: "Energy wasted is money lost. We make buildings use less."
- Primary conversion actions for a savings analysis and product demo.
- Proof statistics for experience, installations, savings, and secured incentives.
- Value propositions: Reduce Energy, Lower Demand, Utility Incentives, Positive Cash Flow, and Turnkey Solutions.
- Product showcase: Occupancy HVAC, Lighting Controls, Exhaust Fans, and DHW & Load Control.
- Cloud platform, industries, case studies, turnkey process, closing conversion banner, and footer.
- Global Day/Night theme architecture.
- Basic metadata, accessibility, browser QA, and optimized media delivery.

## Approved inquiry workflow

- Validate and securely persist public inquiry submissions.
- Protect all administrator routes and inquiry data from public access.
- Show sender name, email, property or company, message, and submission time.
- Allow an authorized administrator to view inquiry details.
- Track New, Contacted, and Closed statuses and filter by status.

This is not a full CRM. Sales pipelines, automation, assignments, bulk messaging, analytics, external CRM synchronization, and multi-role administration are outside the approved scope.

## Technical baseline

- Next.js App Router with React and TypeScript.
- Tailwind CSS for the responsive design system.
- Zod for server-side input and environment validation.
- Next.js Route Handlers for inquiry intake and status changes.
- Supabase PostgreSQL, Supabase Auth, versioned SQL migrations, least-privilege grants, and Row Level Security.
- Vertical Slice Architecture grouping feature UI, validation, server logic, data access, and tests.
- Vitest for fast automated checks and Playwright for critical browser workflows.
- Vercel local, preview, and production environments.

The proposal calls this an initial baseline. Any provider or architecture change that materially affects scope, schedule, migration work, or cost requires approval before implementation.

## Decisions required before public UI implementation

- Resolve whether production styling is strictly monochromatic as specified by the blueprint or uses the green brand accents shown in the reference image.
- Standardize the primary CTA as either "Get a Savings Analysis" or "Get a Free Savings Analysis."
- Approve every public statistic and case-study claim before publication.
- Supply the final logo, approved product photography, industry photography, and platform imagery.
- Supply company copy, contact information, resource links, and any legal footer content.
- Confirm the exact inquiry fields, required fields, consent language, and intended post-submission response.

## Access required before integration and deployment

- Supabase project and administrator-account details.
- Vercel team and project access.
- Domain and DNS access for production launch.
- Authorized staging reviewers and one primary decision-maker.
