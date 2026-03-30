-- Store coordinates on resorts for Overpass API queries
alter table resorts
  alter column latitude type double precision,
  alter column longitude type double precision;

-- Track which runs were skied per visit
create table visit_runs (
  id uuid primary key default uuid_generate_v4(),
  visit_id uuid not null references resort_visits(id) on delete cascade,
  osm_id text not null,
  run_name text,
  difficulty text,
  created_at timestamptz not null default now(),
  unique(visit_id, osm_id)
);

create index on visit_runs(visit_id);

alter table visit_runs enable row level security;

create policy "visit_runs_read" on visit_runs for select using (
  exists (
    select 1 from resort_visits rv
    join profiles p on p.id = rv.profile_id
    where rv.id = visit_id and (p.is_public = true or auth.uid() = p.id)
  )
);
create policy "visit_runs_owner_write" on visit_runs for all using (
  exists (
    select 1 from resort_visits rv
    where rv.id = visit_id and rv.profile_id = auth.uid()
  )
);
