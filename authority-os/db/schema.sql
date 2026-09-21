create extension if not exists pgcrypto;

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  agent_session_id text unique,
  command text not null,
  market text not null,
  objective text not null,
  mode text not null,
  status text not null default 'created',
  canonical_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists artifacts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  kind text not null,
  channel text,
  title text,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists publications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  channel text not null,
  external_id text,
  url text,
  status text not null,
  attempt integer not null default 1,
  response jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  verified_at timestamptz,
  unique(campaign_id, channel, attempt)
);

create table if not exists metrics (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  source text not null,
  metric_date date not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists integration_events (
  id uuid primary key default gen_random_uuid(),
  integration text not null,
  event_type text not null,
  status text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_artifacts_campaign on artifacts(campaign_id);
create index if not exists idx_publications_campaign on publications(campaign_id);
create index if not exists idx_metrics_campaign on metrics(campaign_id);
