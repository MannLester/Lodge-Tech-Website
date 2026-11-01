create function public.analytics_interval_counts(intervals jsonb) returns jsonb
language sql stable set search_path = public as $$
  select jsonb_build_object(
    'first_observed_at', (select min(started_at) from analytics_sessions),
    'counts', coalesce(jsonb_agg(jsonb_build_object(
      'key', period.key,
      'sessions', (select count(*) from analytics_sessions s
        where s.started_at >= period.since_at and s.started_at < period.until_at)
    )), '[]'::jsonb)
  )
  from jsonb_to_recordset(intervals) as period(key text, since_at timestamptz, until_at timestamptz)
  where jsonb_array_length(intervals) <= 128;
$$;
revoke all on function public.analytics_interval_counts(jsonb) from public, anon, authenticated;
grant execute on function public.analytics_interval_counts(jsonb) to service_role;
