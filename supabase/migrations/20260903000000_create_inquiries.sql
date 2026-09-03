create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text not null,
  property_type text not null,
  message text not null,
  status text not null default 'New',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint inquiries_name_length check (char_length(name) between 1 and 100),
  constraint inquiries_email_length check (char_length(email) between 3 and 254),
  constraint inquiries_email_format check (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  constraint inquiries_phone_length check (phone is null or char_length(phone) between 5 and 40),
  constraint inquiries_company_length check (char_length(company) between 1 and 150),
  constraint inquiries_property_type_value check (
    property_type in (
      'hospitality',
      'multifamily',
      'senior-living',
      'student-housing',
      'commercial-office'
    )
  ),
  constraint inquiries_message_length check (char_length(message) between 12 and 5000),
  constraint inquiries_status_value check (status in ('New', 'Contacted', 'Closed'))
);

comment on table public.inquiries is 'Public website savings-analysis inquiries.';
comment on column public.inquiries.status is 'Workflow state managed by the future private CRM.';

create index inquiries_status_created_at_idx
  on public.inquiries (status, created_at desc);

create function public.set_inquiries_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_inquiries_updated_at
before update on public.inquiries
for each row
execute function public.set_inquiries_updated_at();

alter table public.inquiries enable row level security;
alter table public.inquiries force row level security;

revoke all on table public.inquiries from public, anon, authenticated;
grant insert on table public.inquiries to service_role;

revoke all on function public.set_inquiries_updated_at() from public, anon, authenticated;
