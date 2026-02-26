-- Recipes table
create table if not exists recipes (
  slug text primary key,
  data jsonb not null
);

-- Lessons table
create table if not exists lessons (
  slug text primary key,
  data jsonb not null
);

-- Concepts table
create table if not exists concepts (
  slug text primary key,
  data jsonb not null
);

-- Storage bucket for step images
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Allow public read access to images
create policy "Public read access" on storage.objects
  for select using (bucket_id = 'images');

-- Allow authenticated uploads (or use service role from API routes)
create policy "Service role upload" on storage.objects
  for insert with check (bucket_id = 'images');
