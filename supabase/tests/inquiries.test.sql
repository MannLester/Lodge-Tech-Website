begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(27);

select has_table('public', 'inquiries', 'inquiries table exists');
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

set local role service_role;

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
