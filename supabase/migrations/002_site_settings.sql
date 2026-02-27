create table if not exists site_settings (
  key text primary key,
  data jsonb not null default '{}'::jsonb
);

insert into site_settings (key, data)
values ('global', '{}')
on conflict (key) do nothing;
