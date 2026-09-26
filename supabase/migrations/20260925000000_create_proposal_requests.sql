create table public.proposal_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  property_name text not null,
  details jsonb not null,
  attachments jsonb not null default '[]'::jsonb,
  constraint proposal_requests_details_object check (jsonb_typeof(details) = 'object'),
  constraint proposal_requests_attachments_array check (jsonb_typeof(attachments) = 'array')
);

create index proposal_requests_created_at_idx on public.proposal_requests (created_at desc);
alter table public.proposal_requests enable row level security;
alter table public.proposal_requests force row level security;
revoke all on public.proposal_requests from public, anon, authenticated;
grant select, insert on public.proposal_requests to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'proposal-attachments',
  'proposal-attachments',
  false,
  3145728,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;
