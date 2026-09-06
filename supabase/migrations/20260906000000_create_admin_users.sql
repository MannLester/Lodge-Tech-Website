create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now(),
  constraint admin_users_email_lowercase check (email = lower(email)),
  constraint admin_users_email_format check (
    email ~ '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
  )
);

alter table public.admin_users enable row level security;
alter table public.admin_users force row level security;

revoke all on table public.admin_users from anon;
revoke all on table public.admin_users from authenticated;

grant select, insert, update, delete on table public.admin_users to service_role;
