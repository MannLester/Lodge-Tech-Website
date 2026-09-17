alter table public.crm_users
  add column if not exists display_name text,
  add column if not exists job_title text,
  add column if not exists phone text,
  add column if not exists avatar_path text;

alter table public.crm_users
  add constraint crm_users_display_name_length check (
    display_name is null or char_length(display_name) between 1 and 80
  ),
  add constraint crm_users_job_title_length check (
    job_title is null or char_length(job_title) <= 100
  ),
  add constraint crm_users_phone_length check (
    phone is null or char_length(phone) <= 40
  ),
  add constraint crm_users_avatar_path_length check (
    avatar_path is null or char_length(avatar_path) <= 300
  );

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'admin-avatars',
  'admin-avatars',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
