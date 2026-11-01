create table public.analytics_sessions (
 session_id uuid primary key, started_at timestamptz not null, last_observed_at timestamptz not null,
 source text not null check(length(source) between 1 and 160), medium text, campaign text, content text, term text,
 attribution_method text not null check(attribution_method in ('utm','referrer','unknown')), referrer_hostname text,
 landing_page text not null, engagement_time_ms bigint not null default 0,
 check(last_observed_at >= started_at)
);
create table public.analytics_page_views (
 page_view_id uuid primary key, session_id uuid not null references public.analytics_sessions on delete cascade,
 page_path text not null, observed_at timestamptz not null, engagement_time_ms bigint not null default 0 check(engagement_time_ms >= 0)
);
create index analytics_sessions_started on public.analytics_sessions(started_at, source);
create index analytics_pages_session on public.analytics_page_views(session_id);
create table public.analytics_rate_buckets (bucket text primary key, minute timestamptz not null, count integer not null);
alter table public.analytics_sessions enable row level security;
alter table public.analytics_sessions force row level security;
alter table public.analytics_page_views enable row level security;
alter table public.analytics_page_views force row level security;
alter table public.analytics_rate_buckets enable row level security;
alter table public.analytics_rate_buckets force row level security;
revoke all on public.analytics_sessions, public.analytics_page_views, public.analytics_rate_buckets from public, anon, authenticated;
grant all on public.analytics_sessions, public.analytics_page_views, public.analytics_rate_buckets to service_role;

create function public.collect_analytics(p jsonb) returns void language plpgsql set search_path = public as $$
declare sid uuid := (p->>'session_id')::uuid; pid uuid := (p->>'page_view_id')::uuid;
 st timestamptz := (p->>'started_at')::timestamptz; obs timestamptz := (p->>'observed_at')::timestamptz;
 eng bigint := (p->>'engagement_time_ms')::bigint; prior bigint := 0; owner uuid; n integer; a jsonb := p->'attribution';
begin
 perform pg_advisory_xact_lock(hashtextextended(pid::text,0));
 insert into analytics_rate_buckets values ('global',date_trunc('minute',now()),1)
 on conflict(bucket) do update set minute=excluded.minute, count=case when analytics_rate_buckets.minute=excluded.minute then analytics_rate_buckets.count+1 else 1 end returning count into n;
 if n>6000 then return; end if;
 insert into analytics_rate_buckets values (sid::text,date_trunc('minute',now()),1)
 on conflict(bucket) do update set minute=excluded.minute, count=case when analytics_rate_buckets.minute=excluded.minute then analytics_rate_buckets.count+1 else 1 end returning count into n;
 if n>60 then return; end if;
 insert into analytics_sessions(session_id,started_at,last_observed_at,source,medium,campaign,content,term,attribution_method,referrer_hostname,landing_page)
 values(sid,st,st,a->>'source',a->>'medium',a->>'campaign',a->>'content',a->>'term',a->>'attribution_method',a->>'referrer_hostname',p->>'landing_page') on conflict do nothing;
 perform 1 from analytics_sessions where session_id=sid for update;
 if not exists(select 1 from analytics_sessions where session_id=sid and started_at=st) then return; end if;
 select session_id, engagement_time_ms into owner,prior from analytics_page_views where page_view_id=pid;
 if owner is not null and owner<>sid then return; end if;
 insert into analytics_page_views values(pid,sid,p->>'page_path',(p->>'page_observed_at')::timestamptz,eng)
 on conflict(page_view_id) do update set engagement_time_ms=greatest(analytics_page_views.engagement_time_ms,excluded.engagement_time_ms);
 update analytics_sessions set last_observed_at=greatest(last_observed_at,obs), engagement_time_ms=engagement_time_ms+greatest(0,eng-coalesce(prior,0)) where session_id=sid;
end $$;

create function public.analytics_report(since_at timestamptz, until_at timestamptz, source_filter text default null, page_number integer default 0)
returns jsonb language sql stable set search_path=public as $$
with sessions as (select *, extract(epoch from(last_observed_at-started_at))*1000 as duration from analytics_sessions where started_at>=since_at and started_at<until_at and (source_filter is null or source=source_filter or (source_filter='__other' and source not in ('instagram','facebook','linkedin','google','tiktok','unknown')))),
totals as (select count(*) sessions, coalesce(sum((select count(*) from analytics_page_views v where v.session_id=s.session_id)),0) page_views, coalesce(avg(duration),0) duration_ms, coalesce(avg(engagement_time_ms),0) engagement_ms from sessions s),
sources as (select source, count(*) sessions, avg(duration) duration_ms, avg(engagement_time_ms) engagement_ms from sessions group by source),
landings as (select landing_page, count(*) sessions from sessions group by landing_page order by count(*) desc limit 20),
campaigns as (select source,medium,campaign,count(*) sessions,avg(duration) duration_ms,avg(engagement_time_ms) engagement_ms from sessions where campaign is not null group by source,medium,campaign order by count(*) desc,source,campaign limit 25 offset greatest(0,page_number)*25)
select jsonb_build_object('totals',(select to_jsonb(t) from totals t),'sources',coalesce((select jsonb_agg(s) from sources s),'[]'),'landings',coalesce((select jsonb_agg(l) from landings l),'[]'),'campaigns',coalesce((select jsonb_agg(c) from campaigns c),'[]')) $$;
create function public.cleanup_analytics(retention_days integer default 90) returns void language plpgsql set search_path=public as $$
begin
 if retention_days<1 then raise exception 'Invalid retention'; end if;
 delete from analytics_sessions where started_at<now()-make_interval(days=>retention_days);
 delete from analytics_rate_buckets where minute<now()-interval '1 day';
end $$;
revoke all on function public.collect_analytics(jsonb), public.analytics_report(timestamptz,timestamptz,text,integer), public.cleanup_analytics(integer) from public,anon,authenticated;
grant execute on function public.collect_analytics(jsonb), public.analytics_report(timestamptz,timestamptz,text,integer), public.cleanup_analytics(integer) to service_role;
