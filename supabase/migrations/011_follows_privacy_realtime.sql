-- ============================================================
-- Follows, follower-level privacy, block enforcement, realtime
-- ============================================================

-- 追蹤關係
create table if not exists follows (
  follower_id  uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create index if not exists follows_following_id_idx on follows(following_id);

alter table follows enable row level security;

drop policy if exists "follows_read" on follows;
create policy "follows_read" on follows for select using (true);

drop policy if exists "follows_owner_insert" on follows;
create policy "follows_owner_insert" on follows for insert
  with check (auth.uid() = follower_id);

drop policy if exists "follows_owner_delete" on follows;
create policy "follows_owner_delete" on follows for delete
  using (auth.uid() = follower_id);

-- 雙向封鎖檢查。security definer 繞過 blocked_users 的 RLS，
-- 讓「被封鎖的一方」的查詢也能感知封鎖狀態。
create or replace function blocked_between(a uuid, b uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from blocked_users
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

revoke all on function blocked_between(uuid, uuid) from public;
grant execute on function blocked_between(uuid, uuid) to authenticated, anon;

-- 區塊層級隱私（public / followers / private）＋封鎖檢查
create or replace function can_view_section(owner_id uuid, section text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select
    auth.uid() = owner_id
    or (
      not blocked_between(auth.uid(), owner_id)
      and case coalesce(
        (select privacy_settings->>section from profiles where id = owner_id),
        'public'
      )
        when 'public' then true
        when 'followers' then auth.uid() is not null and exists (
          select 1 from follows f
          where f.follower_id = auth.uid() and f.following_id = owner_id
        )
        else false
      end
    );
$$;

revoke all on function can_view_section(uuid, text) from public;
grant execute on function can_view_section(uuid, text) to authenticated, anon;

-- 重建讀取政策：支援 followers 層級，且封鎖雙向都看不到
drop policy if exists "resort_visits_read" on resort_visits;
create policy "resort_visits_read" on resort_visits for select
  using (can_view_section(profile_id, 'resort_visits'));

drop policy if exists "equipment_read" on equipment;
create policy "equipment_read" on equipment for select
  using (
    auth.uid() = profile_id
    or (is_public = true and can_view_section(profile_id, 'equipment'))
  );

drop policy if exists "trips_read" on trips;
create policy "trips_read" on trips for select
  using (
    auth.uid() = profile_id
    or (is_public = true and not blocked_between(auth.uid(), profile_id))
  );

drop policy if exists "posts_public_read" on posts;
create policy "posts_public_read" on posts for select
  using (
    auth.uid() = profile_id
    or (is_public = true and not blocked_between(auth.uid(), profile_id))
  );

-- 封鎖後（任一方向）禁止傳訊
drop policy if exists "messages_insert" on messages;
create policy "messages_insert" on messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from conversations c
      where c.id = conversation_id
        and (c.user_a = auth.uid() or c.user_b = auth.uid())
        and not blocked_between(c.user_a, c.user_b)
    )
  );

-- 開啟 messages 的 Realtime（供聊天室即時更新）
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table messages;
  end if;
end $$;
