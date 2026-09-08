insert into public.crm_users (email, role, status)
values
  ('22-00486@g.batstate-u.edu.ph', 'USER', 'INVITED'),
  ('minatohuhu@gmail.com', 'MANAGER', 'INVITED')
on conflict (email) do update
set role = excluded.role;
