-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- Resorts (static reference data)
-- ============================================================
create table resorts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  name_zh text,
  country text not null,
  region text,
  latitude numeric(9,6),
  longitude numeric(9,6)
);

-- ============================================================
-- Profiles (1:1 with auth.users)
-- ============================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  short_link text unique not null,
  trip_status text check (trip_status in ('teaching', 'learning', 'finding_buddy')),
  privacy_settings jsonb not null default '{"resort_visits":"public","equipment":"public","trip_status":"public"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Resort Visits (ski footprints)
-- ============================================================
create table resort_visits (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  resort_id uuid not null references resorts(id),
  visited_at date,
  notes text,
  created_at timestamptz not null default now(),
  unique(profile_id, resort_id, visited_at)
);

-- ============================================================
-- Equipment
-- ============================================================
create table equipment (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  category text not null check (category in ('board','skis','boots','helmet','goggles','outerwear','other')),
  brand text,
  model text,
  year int,
  notes text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Tags
-- ============================================================
create table tags (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  category text not null check (category in ('skill','style','resort','general'))
);

create table profile_tags (
  profile_id uuid not null references profiles(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (profile_id, tag_id)
);

-- ============================================================
-- Indexes
-- ============================================================
create index on resort_visits(profile_id);
create index on equipment(profile_id);
create index on profile_tags(profile_id);
create index on profiles(username);
create index on profiles(short_link);

-- ============================================================
-- RLS Policies
-- ============================================================
alter table profiles enable row level security;
alter table resort_visits enable row level security;
alter table equipment enable row level security;
alter table profile_tags enable row level security;
alter table resorts enable row level security;
alter table tags enable row level security;

-- profiles: public read, owner write
create policy "profiles_public_read" on profiles for select using (true);
create policy "profiles_owner_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_owner_update" on profiles for update using (auth.uid() = id);
create policy "profiles_owner_delete" on profiles for delete using (auth.uid() = id);

-- resort_visits: respect privacy_settings
create policy "resort_visits_read" on resort_visits for select using (
  (select (privacy_settings->>'resort_visits') from profiles where id = profile_id) = 'public'
  or auth.uid() = profile_id
);
create policy "resort_visits_owner_write" on resort_visits for all using (auth.uid() = profile_id);

-- equipment: respect is_public flag + privacy_settings
create policy "equipment_read" on equipment for select using (
  is_public = true
  and (select (privacy_settings->>'equipment') from profiles where id = profile_id) = 'public'
  or auth.uid() = profile_id
);
create policy "equipment_owner_write" on equipment for all using (auth.uid() = profile_id);

-- profile_tags: public read, owner write
create policy "profile_tags_read" on profile_tags for select using (true);
create policy "profile_tags_owner_write" on profile_tags for all using (auth.uid() = profile_id);

-- resorts & tags: public read only
create policy "resorts_read" on resorts for select using (true);
create policy "tags_read" on tags for select using (true);

-- ============================================================
-- Auto-update updated_at
-- ============================================================
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure handle_updated_at();

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  _username text;
  _short_link text;
begin
  _username := coalesce(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );
  _short_link := lower(regexp_replace(_username, '[^a-zA-Z0-9]', '', 'g'));

  insert into profiles (id, username, short_link, display_name)
  values (
    new.id,
    _username,
    _short_link,
    coalesce(new.raw_user_meta_data->>'display_name', _username)
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
