-- ============================================================
-- Account type: 一般雪友 / 教練 / 滑雪學校 / 雪場民宿
-- ============================================================

alter table profiles
  add column if not exists account_type text not null default 'skier'
    check (account_type in ('skier', 'coach', 'school', 'lodging'));

create index if not exists profiles_account_type_idx
  on profiles(account_type) where account_type <> 'skier';
