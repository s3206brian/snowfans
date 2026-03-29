-- ============================================================
-- Trips (行程卡片)
-- ============================================================
create table trips (
  id           uuid primary key default uuid_generate_v4(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  resort_id    uuid references resorts(id) on delete set null,
  resort_name  text,                          -- 自填雪場名稱（當 resort_id 不存在時）
  start_date   date not null,
  end_date     date,
  status       text not null check (status in ('teaching', 'finding_buddy', 'learning')),
  description  text,
  is_public    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index on trips(profile_id);
create index on trips(start_date);

-- ============================================================
-- RLS
-- ============================================================
alter table trips enable row level security;

-- 公開行程所有人可見，私人行程只有本人可見
create policy "trips_read" on trips for select using (
  is_public = true or auth.uid() = profile_id
);

create policy "trips_owner_write" on trips for all using (
  auth.uid() = profile_id
);
