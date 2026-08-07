-- Archive411 phase 1 — saved designers, collections items, fitting lists, showrooms

create table if not exists public.saved_designers (
  user_id uuid not null references auth.users(id) on delete cascade,
  designer_id text not null references public.designers(id) on delete cascade,
  followed boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (user_id, designer_id)
);

create table if not exists public.collection_items (
  id text primary key,
  collection_id text not null references public.archive_collections(id) on delete cascade,
  item_id text not null,
  item_type text not null check (item_type in ('lookbook', 'product', 'designer')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists collection_items_collection_id_idx on public.collection_items(collection_id);

create table if not exists public.fitting_lists (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  showroom_id text,
  title text not null,
  items jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fitting_lists_user_id_idx on public.fitting_lists(user_id);

create table if not exists public.showrooms (
  id text primary key,
  slug text not null unique,
  name text not null,
  city text not null,
  country text not null,
  description text not null default '',
  cover_image_url text not null default '',
  website text,
  appointment_url text,
  aesthetic_tags text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.concept_stores (
  id text primary key,
  slug text not null unique,
  name text not null,
  city text not null,
  country text not null,
  description text not null default '',
  website text,
  cover_image_url text not null default '',
  aesthetic_tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.saved_designers enable row level security;
alter table public.collection_items enable row level security;
alter table public.fitting_lists enable row level security;
alter table public.showrooms enable row level security;
alter table public.concept_stores enable row level security;

create policy "saved_designers_own" on public.saved_designers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "collection_items_via_collection" on public.collection_items
  for all using (
    exists (
      select 1 from public.archive_collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

create policy "fitting_lists_own" on public.fitting_lists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "showrooms_public_read" on public.showrooms for select using (true);
create policy "concept_stores_public_read" on public.concept_stores for select using (true);
