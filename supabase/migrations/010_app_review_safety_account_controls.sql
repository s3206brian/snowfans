-- ============================================================
-- App Review safety/account controls
-- ============================================================

alter table profiles
  add column if not exists eula_accepted_at timestamptz;

create table if not exists blocked_users (
  id uuid primary key default uuid_generate_v4(),
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create index if not exists blocked_users_blocker_id_idx on blocked_users(blocker_id);
create index if not exists blocked_users_blocked_id_idx on blocked_users(blocked_id);

create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  reported_id uuid references profiles(id) on delete set null,
  content_type text not null default 'profile'
    check (content_type in ('profile', 'trip', 'equipment', 'message')),
  content_id uuid,
  reason text not null
    check (reason in ('inappropriate_content', 'harassment', 'spam', 'other')),
  details text,
  status text not null default 'open'
    check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists reports_reporter_id_idx on reports(reporter_id);
create index if not exists reports_reported_id_idx on reports(reported_id);
create index if not exists reports_status_created_at_idx on reports(status, created_at);

alter table blocked_users enable row level security;
alter table reports enable row level security;

drop policy if exists "blocked_users_owner_read" on blocked_users;
create policy "blocked_users_owner_read" on blocked_users for select
  using (auth.uid() = blocker_id);

drop policy if exists "blocked_users_owner_insert" on blocked_users;
create policy "blocked_users_owner_insert" on blocked_users for insert
  with check (auth.uid() = blocker_id);

drop policy if exists "blocked_users_owner_delete" on blocked_users;
create policy "blocked_users_owner_delete" on blocked_users for delete
  using (auth.uid() = blocker_id);

drop policy if exists "reports_owner_insert" on reports;
create policy "reports_owner_insert" on reports for insert
  with check (auth.uid() = reporter_id);

drop policy if exists "reports_owner_read" on reports;
create policy "reports_owner_read" on reports for select
  using (auth.uid() = reporter_id);

-- Hide content from users blocked by its author.
drop policy if exists "trips_read" on trips;
create policy "trips_read" on trips for select using (
  (is_public = true or auth.uid() = profile_id)
  and not exists (
    select 1 from blocked_users b
    where b.blocker_id = auth.uid()
      and b.blocked_id = trips.profile_id
  )
);

drop policy if exists "equipment_read" on equipment;
create policy "equipment_read" on equipment for select using (
  (
    (
      is_public = true
      and (select (privacy_settings->>'equipment') from profiles where id = profile_id) = 'public'
    )
    or auth.uid() = profile_id
  )
  and not exists (
    select 1 from blocked_users b
    where b.blocker_id = auth.uid()
      and b.blocked_id = equipment.profile_id
  )
);

drop policy if exists "messages_mark_read" on messages;
create policy "messages_mark_read" on messages for update
  using (
    exists (
      select 1 from conversations c
      where c.id = conversation_id
        and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  )
  with check (
    sender_id <> auth.uid()
    and exists (
      select 1 from conversations c
      where c.id = conversation_id
        and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );

-- Client-callable account deletion for Guideline 5.1.1(v).
create or replace function delete_current_user()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;

  delete from auth.users where id = uid;
end;
$$;

revoke all on function delete_current_user() from public;
grant execute on function delete_current_user() to authenticated;
