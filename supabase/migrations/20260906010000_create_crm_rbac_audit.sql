create type public.crm_access_role as enum ('USER', 'MANAGER', 'ADMIN');
create type public.crm_user_status as enum ('INVITED', 'ACTIVE', 'DISABLED');

create table public.crm_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  auth_user_id uuid unique,
  role public.crm_access_role not null default 'USER',
  status public.crm_user_status not null default 'INVITED',
  created_at timestamptz not null default now(),
  created_by uuid references public.crm_users(id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.crm_users(id) on delete set null,
  last_login_at timestamptz,
  disabled_at timestamptz,
  constraint crm_users_email_lowercase check (email = lower(email)),
  constraint crm_users_email_format check (
    email ~ '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
  ),
  constraint crm_users_active_has_auth_user check (
    status <> 'ACTIVE' or auth_user_id is not null
  ),
  constraint crm_users_disabled_has_timestamp check (
    status <> 'DISABLED' or disabled_at is not null
  )
);

insert into public.crm_users (email, role, status, created_at, updated_at)
select email, 'ADMIN'::public.crm_access_role, 'INVITED'::public.crm_user_status, created_at, created_at
from public.admin_users
on conflict (email) do nothing;

update public.crm_users crm_user
set auth_user_id = auth_user.id,
    status = 'ACTIVE',
    last_login_at = greatest(crm_user.last_login_at, auth_user.last_sign_in_at),
    updated_at = now()
from auth.users auth_user
where lower(auth_user.email) = crm_user.email
  and crm_user.auth_user_id is null;

create index crm_users_status_role_idx on public.crm_users (status, role);
create index crm_users_email_idx on public.crm_users (email);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_crm_user_id uuid references public.crm_users(id) on delete set null,
  actor_auth_user_id uuid,
  actor_email text,
  actor_role public.crm_access_role,
  action text not null,
  resource_type text not null,
  resource_id text,
  before_data jsonb,
  after_data jsonb,
  request_id text,
  constraint audit_logs_action_format check (action ~ '^[a-z0-9_.-]+$'),
  constraint audit_logs_resource_type_format check (resource_type ~ '^[a-z0-9_.-]+$')
);

create index audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index audit_logs_actor_created_at_idx on public.audit_logs (actor_crm_user_id, created_at desc);
create index audit_logs_action_created_at_idx on public.audit_logs (action, created_at desc);
create index audit_logs_resource_idx on public.audit_logs (resource_type, resource_id);

create function public.touch_crm_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger crm_users_touch_updated_at
before update on public.crm_users
for each row
execute function public.touch_crm_users_updated_at();

create function public.prevent_last_active_admin_loss()
returns trigger
language plpgsql
as $$
begin
  if old.role = 'ADMIN'
     and old.status = 'ACTIVE'
     and (new.role <> 'ADMIN' or new.status <> 'ACTIVE') then
    if not exists (
      select 1
      from public.crm_users
      where id <> old.id
        and role = 'ADMIN'
        and status = 'ACTIVE'
    ) then
      raise exception 'At least one active ADMIN is required';
    end if;
  end if;

  return new;
end;
$$;

create trigger crm_users_prevent_last_active_admin_loss
before update on public.crm_users
for each row
execute function public.prevent_last_active_admin_loss();

create function public.prevent_audit_log_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Audit logs are immutable';
end;
$$;

create trigger audit_logs_prevent_update
before update on public.audit_logs
for each row
execute function public.prevent_audit_log_mutation();

create trigger audit_logs_prevent_delete
before delete on public.audit_logs
for each row
execute function public.prevent_audit_log_mutation();

alter table public.crm_users enable row level security;
alter table public.crm_users force row level security;
alter table public.audit_logs enable row level security;
alter table public.audit_logs force row level security;

revoke all on table public.crm_users from anon;
revoke all on table public.crm_users from authenticated;
revoke all on table public.audit_logs from anon;
revoke all on table public.audit_logs from authenticated;

grant select, insert, update, delete on table public.crm_users to service_role;
grant select, insert on table public.audit_logs to service_role;

alter table public.admin_users rename to admin_users_legacy;

create view public.admin_users as
select email, created_at
from public.crm_users
where status in ('INVITED', 'ACTIVE');

grant select on table public.admin_users to service_role;
revoke all on table public.admin_users from anon;
revoke all on table public.admin_users from authenticated;
