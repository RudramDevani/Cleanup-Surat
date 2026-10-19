-- CleanUp Surat: run this whole file once in Supabase -> SQL Editor -> New query -> Run.
-- Safe to run again, and it removes the earlier online-bidding pieces if they exist.

drop function if exists list_items();
drop function if exists place_bid(text, text, text, int);
drop table if exists bids;

create table if not exists items (
  id text primary key,
  name text not null,
  category text,
  condition text,
  details text,
  image text,
  adopted boolean not null default false,
  created_at timestamptz default now()
);
alter table items drop column if exists start_price;
alter table items drop column if exists ends_at;
alter table items add column if not exists adopted boolean not null default false;

create table if not exists submissions (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('volunteer','organization','report','contact')),
  data jsonb not null check (pg_column_size(data) < 6000),
  created_at timestamptz default now()
);

alter table items enable row level security;
alter table submissions enable row level security;

-- Visitors can read items and send forms. They can never read form submissions.
drop policy if exists "read items" on items;
create policy "read items" on items for select using (true);
drop policy if exists "send forms" on submissions;
create policy "send forms" on submissions for insert with check (true);

revoke all on items, submissions from anon, authenticated;
grant select on items to anon, authenticated;
grant insert on submissions to anon, authenticated;

-- Sample items (edit or delete them later in Table Editor -> items)
insert into items (id, name, category, condition, details, image) values
 ('ganesh-idol-01', 'Ganesh idol (sample, replace me)', 'Idol', 'Good, no cracks', 'Sample entry. Replace with a real item: size, material, any damage.', '/adopt/ganesh-idol-01.jpg'),
 ('brass-diya-set-01', 'Brass diya set (sample, replace me)', 'Puja items', 'Usable, needs polishing', 'Sample entry. Set of 5 brass diyas.', '/adopt/brass-diya-set-01.jpg')
on conflict (id) do nothing;
