create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  title text not null,
  notes text,
  due_at date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint follow_ups_title_length check (char_length(title) between 1 and 160),
  constraint follow_ups_notes_length check (notes is null or char_length(notes) <= 2000)
);

create index follow_ups_due_at_idx on public.follow_ups (due_at, completed_at);
alter table public.follow_ups enable row level security;
alter table public.follow_ups force row level security;
revoke all on table public.follow_ups from public, anon, authenticated;
grant select, insert, update, delete on table public.follow_ups to service_role;
