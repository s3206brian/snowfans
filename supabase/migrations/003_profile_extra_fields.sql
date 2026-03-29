alter table profiles
  add column if not exists board_type text check (board_type in ('snowboard', 'ski', 'both')),
  add column if not exists years_experience int,
  add column if not exists instructor_cert boolean not null default false;
