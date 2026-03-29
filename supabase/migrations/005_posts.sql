-- Posts table
create table posts (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  resort_id uuid references resorts(id) on delete set null,
  title text,
  content text,
  image_urls text[] not null default '{}',
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create index on posts(profile_id);
create index on posts(resort_id);
create index on posts(created_at desc);

alter table posts enable row level security;

create policy "posts_public_read" on posts for select
  using (is_public = true or auth.uid() = profile_id);
create policy "posts_owner_insert" on posts for insert
  with check (auth.uid() = profile_id);
create policy "posts_owner_delete" on posts for delete
  using (auth.uid() = profile_id);

-- Storage policies for post-images bucket
create policy "post_images_select" on storage.objects for select
  using (bucket_id = 'post-images');
create policy "post_images_insert" on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');
create policy "post_images_delete" on storage.objects for delete
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');
