begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(40);

select has_table('public', 'inquiries', 'inquiries table exists');
select has_table('public', 'crm_users', 'CRM access users table exists');
select has_table('public', 'audit_logs', 'audit logs table exists');
select has_view('public', 'admin_users', 'legacy admin_users view exists');
select has_enum('public', 'crm_access_role', 'CRM access role enum exists');
select has_enum('public', 'crm_user_status', 'CRM user status enum exists');
select has_index(
  'public',
  'inquiries',
  'inquiries_status_created_at_idx',
  'status and created date index exists'
);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.inquiries'::regclass),
  'row level security is enabled'
);
select ok(
  (select relforcerowsecurity from pg_class where oid = 'public.inquiries'::regclass),
  'row level security is forced'
);
select ok(
  (select relforcerowsecurity from pg_class where oid = 'public.crm_users'::regclass),
  'CRM access users row level security is forced'
);
select ok(
  (select relforcerowsecurity from pg_class where oid = 'public.audit_logs'::regclass),
  'audit logs row level security is forced'
);

select has_table('public', 'inquiry_activities', 'inquiry activity table exists');
select has_index(
  'public',
  'inquiry_activities',
  'inquiry_activities_inquiry_created_at_idx',
  'inquiry activity timeline index exists'
);
select has_index(
  'public',
  'follow_ups',
  'follow_ups_inquiry_id_idx',
  'lead task lookup index exists'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.inquiry_activities'::regclass),
  'inquiry activity row level security is enabled'
);
select ok(
  not has_table_privilege('anon', 'public.inquiry_activities', 'select'),
  'anon cannot read inquiry activity'
);
select ok(
  not has_table_privilege('authenticated', 'public.inquiry_activities', 'select'),
  'authenticated cannot read inquiry activity'
);

select ok(not has_table_privilege('anon', 'public.inquiries', 'select'), 'anon cannot select');
select ok(not has_table_privilege('anon', 'public.inquiries', 'insert'), 'anon cannot insert');
select ok(not has_table_privilege('anon', 'public.inquiries', 'update'), 'anon cannot update');
select ok(not has_table_privilege('anon', 'public.inquiries', 'delete'), 'anon cannot delete');
select ok(not has_table_privilege('authenticated', 'public.inquiries', 'select'), 'authenticated cannot select');
select ok(not has_table_privilege('authenticated', 'public.inquiries', 'insert'), 'authenticated cannot insert');
select ok(not has_table_privilege('authenticated', 'public.inquiries', 'update'), 'authenticated cannot update');
select ok(not has_table_privilege('authenticated', 'public.inquiries', 'delete'), 'authenticated cannot delete');
select ok(not has_table_privilege('authenticated', 'public.crm_users', 'select'), 'authenticated cannot read CRM access users');
select ok(not has_table_privilege('authenticated', 'public.audit_logs', 'select'), 'authenticated cannot read audit logs');

set local role service_role;

select is(
  (
    select role::text
    from public.crm_users
    where email = '22-00486@g.batstate-u.edu.ph'
  ),
  'USER',
  'seeds the requested user account'
);

select is(
  (
    select role::text
    from public.crm_users
    where email = 'minatohuhu@gmail.com'
  ),
  'MANAGER',
  'seeds the requested manager account'
);

select lives_ok(
  $$insert into public.crm_users (email, role, status, auth_user_id)
    values ('admin@example.com', 'ADMIN', 'ACTIVE', gen_random_uuid())$$,
  'service role can seed an active admin'
);

select lives_ok(
  $$insert into public.crm_users (email, role)
    values ('operator@example.com', 'USER')$$,
  'service role can invite an operational user'
);

select throws_ok(
  $$update public.crm_users set role = 'USER' where email = 'admin@example.com'$$,
  'P0001',
  null,
  'last active admin cannot be demoted'
);

select lives_ok(
  $$insert into public.audit_logs (action, resource_type, actor_email)
    values ('access.invite', 'crm_user', 'admin@example.com')$$,
  'service role can append audit logs'
);

select throws_ok(
  $$update public.audit_logs set action = 'changed' where actor_email = 'admin@example.com'$$,
  'P0001',
  null,
  'audit logs cannot be updated'
);

select lives_ok(
  $$insert into public.inquiries (name, email, company, property_type, message)
    values ('Morgan Lee', 'morgan@example.com', 'Harbor Hotel', 'hospitality', 'Evaluate HVAC savings.')$$,
  'service role can insert a valid inquiry'
);

select throws_ok(
  $$insert into public.inquiries (name, email, company, property_type, message)
    values ('Morgan Lee', 'invalid', 'Harbor Hotel', 'hospitality', 'Evaluate HVAC savings.')$$,
  '23514',
  null,
  'invalid email is rejected'
);

select throws_ok(
  $$insert into public.inquiries (name, email, company, property_type, message)
    values ('Morgan Lee', 'morgan@example.com', 'Harbor Hotel', 'castle', 'Evaluate HVAC savings.')$$,
  '23514',
  null,
  'unknown property type is rejected'
);

select throws_ok(
  $$insert into public.inquiries (name, email, phone, company, property_type, message)
    values ('Morgan Lee', 'morgan@example.com', '1', 'Harbor Hotel', 'hospitality', 'Evaluate HVAC savings.')$$,
  '23514',
  null,
  'invalid phone length is rejected'
);

select lives_ok(
  $$update public.inquiries set status = 'Qualified' where email = 'morgan@example.com'$$,
  'accepts the Qualified CRM status'
);

select lives_ok(
  $$update public.inquiries set status = 'Won' where email = 'morgan@example.com'$$,
  'accepts the Won CRM status'
);

select is(
  (
    select count(*)::integer
    from public.inquiry_activities
    where activity_type = 'status_change'
  ),
  2,
  'records status changes automatically'
);

select lives_ok(
  $$insert into public.inquiry_activities (inquiry_id, activity_type, body)
    select id, 'note', 'Called the property manager.'
    from public.inquiries where email = 'morgan@example.com'$$,
  'accepts a valid lead note'
);

select throws_ok(
  $$insert into public.inquiry_activities (inquiry_id, activity_type, body)
    select id, 'note', null
    from public.inquiries where email = 'morgan@example.com'$$,
  '23514',
  null,
  'rejects a note without a body'
);

reset role;
select * from finish();
rollback;
