alter table public.inquiries
  drop constraint inquiries_status_value;

alter table public.inquiries
  add constraint inquiries_status_value check (
    status in ('New', 'Contacted', 'Qualified', 'Won', 'Lost', 'Closed')
  );

comment on column public.inquiries.status is
  'CRM lead stage. Closed is retained only for legacy records awaiting a Won or Lost outcome.';

create table public.inquiry_activities (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  activity_type text not null,
  body text,
  from_status text,
  to_status text,
  created_at timestamptz not null default now(),
  constraint inquiry_activities_type_value check (
    activity_type in ('note', 'status_change')
  ),
  constraint inquiry_activities_body_length check (
    body is null or char_length(body) between 1 and 2000
  ),
  constraint inquiry_activities_from_status_value check (
    from_status is null or from_status in ('New', 'Contacted', 'Qualified', 'Won', 'Lost', 'Closed')
  ),
  constraint inquiry_activities_to_status_value check (
    to_status is null or to_status in ('New', 'Contacted', 'Qualified', 'Won', 'Lost', 'Closed')
  ),
  constraint inquiry_activities_shape check (
    (activity_type = 'note' and body is not null and from_status is null and to_status is null)
    or
    (activity_type = 'status_change' and body is null and from_status is not null and to_status is not null)
  )
);

create index inquiry_activities_inquiry_created_at_idx
  on public.inquiry_activities (inquiry_id, created_at desc);

create index follow_ups_inquiry_id_idx
  on public.follow_ups (inquiry_id);

create function public.record_inquiry_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status is distinct from new.status then
    insert into public.inquiry_activities (
      inquiry_id,
      activity_type,
      from_status,
      to_status
    ) values (
      new.id,
      'status_change',
      old.status,
      new.status
    );
  end if;
  return new;
end;
$$;

create trigger record_inquiry_status_change
after update of status on public.inquiries
for each row
execute function public.record_inquiry_status_change();

alter table public.inquiry_activities enable row level security;
alter table public.inquiry_activities force row level security;
revoke all on table public.inquiry_activities from public, anon, authenticated;
grant select, insert on table public.inquiry_activities to service_role;
revoke all on function public.record_inquiry_status_change() from public, anon, authenticated;
