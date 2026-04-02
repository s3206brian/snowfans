-- ============================================================
-- Conversations & Messages (私訊)
-- ============================================================

create table conversations (
  id          uuid primary key default uuid_generate_v4(),
  user_a      uuid not null references profiles(id) on delete cascade,
  user_b      uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(user_a, user_b)
);

create index on conversations(user_a);
create index on conversations(user_b);

create table messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id       uuid not null references profiles(id) on delete cascade,
  body            text not null,
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index on messages(conversation_id, created_at);

-- RLS
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "conversations_read" on conversations for select
  using (auth.uid() = user_a or auth.uid() = user_b);

create policy "conversations_insert" on conversations for insert
  with check (auth.uid() = user_a or auth.uid() = user_b);

create policy "messages_read" on messages for select
  using (
    exists (
      select 1 from conversations c
      where c.id = conversation_id
      and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );

create policy "messages_insert" on messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from conversations c
      where c.id = conversation_id
      and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );
