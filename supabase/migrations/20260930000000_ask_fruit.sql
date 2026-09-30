-- Ask Fruit: the public AI assistant at /ask-fruit (ported from Proploy's Ask Sam).
--
-- Lives in the portal Supabase project (PORTAL_SUPABASE_*). Visitors are
-- anonymous: each browser gets a random visitor id in an httpOnly cookie, set by
-- the Ask Fruit route handlers, and every row is scoped to it in application
-- code. Only the service role touches these tables. RLS is on with no policies,
-- and anon/authenticated have no grants, so the anon key can read nothing.
--
-- One row per evaluation, with the conversation, requirements, decision board
-- and briefs as JSONB. This is the compact shape Proploy settled on after its
-- ten-table design (service-apis migration 042) and suits a single-writer turn.

create table if not exists public.ask_fruit_evaluations (
  id             text primary key,
  visitor_id     text not null,
  title          text not null default 'New conversation',
  stage          text not null default 'discovery'
                   check (stage in ('discovery', 'recommending', 'comparing', 'planning')),
  status         text not null default 'active'
                   check (status in ('active', 'archived', 'deleted')),
  requirements   jsonb not null default '{}'::jsonb,
  open_questions jsonb not null default '[]'::jsonb,
  matches        jsonb not null default '[]'::jsonb,
  shortlist      jsonb not null default '[]'::jsonb,
  documents      jsonb not null default '[]'::jsonb,
  messages       jsonb not null default '[]'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists ask_fruit_evaluations_visitor_idx
  on public.ask_fruit_evaluations (visitor_id, updated_at desc)
  where status <> 'deleted';

create index if not exists ask_fruit_evaluations_updated_idx
  on public.ask_fruit_evaluations (updated_at desc);

-- One row per agent turn: rate limiting, cost tracking and failure analysis.
create table if not exists public.ask_fruit_turns (
  id                bigint generated always as identity primary key,
  evaluation_id     text references public.ask_fruit_evaluations (id) on delete cascade,
  visitor_id        text not null,
  ip_hash           text,
  status            text not null check (status in ('completed', 'failed', 'aborted')),
  error_code        text,
  model             text,
  steps             integer,
  prompt_tokens     integer,
  completion_tokens integer,
  cost_usd          numeric(12, 6),
  latency_ms        integer,
  created_at        timestamptz not null default now()
);

create index if not exists ask_fruit_turns_visitor_idx on public.ask_fruit_turns (visitor_id, created_at desc);
create index if not exists ask_fruit_turns_ip_idx on public.ask_fruit_turns (ip_hash, created_at desc);
create index if not exists ask_fruit_turns_created_idx on public.ask_fruit_turns (created_at desc);

create or replace function public.ask_fruit_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ask_fruit_evaluations_touch on public.ask_fruit_evaluations;
create trigger ask_fruit_evaluations_touch
  before update on public.ask_fruit_evaluations
  for each row execute function public.ask_fruit_touch_updated_at();

-- Every limit the chat route checks, in one round trip.
create or replace function public.ask_fruit_usage(p_visitor_id text, p_ip_hash text)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'visitor_hour', (select count(*) from public.ask_fruit_turns
                     where visitor_id = p_visitor_id and created_at > now() - interval '1 hour'),
    'visitor_day',  (select count(*) from public.ask_fruit_turns
                     where visitor_id = p_visitor_id and created_at > now() - interval '1 day'),
    'ip_day',       (select count(*) from public.ask_fruit_turns
                     where p_ip_hash is not null and ip_hash = p_ip_hash
                       and created_at > now() - interval '1 day'),
    'cost_day',     (select coalesce(sum(cost_usd), 0) from public.ask_fruit_turns
                     where created_at > now() - interval '1 day')
  );
$$;

alter table public.ask_fruit_evaluations enable row level security;
alter table public.ask_fruit_turns enable row level security;

revoke all on public.ask_fruit_evaluations from anon, authenticated;
revoke all on public.ask_fruit_turns from anon, authenticated;
revoke execute on function public.ask_fruit_usage(text, text) from public, anon, authenticated;
revoke execute on function public.ask_fruit_touch_updated_at() from public, anon, authenticated;
grant execute on function public.ask_fruit_usage(text, text) to service_role;
