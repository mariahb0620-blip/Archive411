-- Archive411 initial schema — run in Supabase SQL editor or via CLI

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  preferred_currency text not null default 'USD',
  preferences jsonb not null default '{}'::jsonb,
  onboarding_status text not null default 'complete',
  auth_provider text not null default 'email',
  is_guest boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Designers (public catalog)
create table if not exists public.designers (
  id text primary key,
  slug text not null unique,
  label_name text not null,
  label_type text not null,
  biography text not null default '',
  city text not null,
  country text not null,
  cover_image_url text not null default '',
  website text,
  instagram text,
  social_links jsonb not null default '{}'::jsonb,
  aesthetic_tags text[] not null default '{}',
  size_range text not null default '',
  price_range jsonb not null default '{}'::jsonb,
  shipping_locations text[] not null default '{}',
  made_to_order boolean not null default false,
  custom_sizing boolean not null default false,
  verification_status text not null default 'unverified',
  website_connection_type text not null default 'manual',
  featured boolean not null default false,
  is_independent boolean not null default false,
  is_emerging boolean not null default false,
  is_reference_example boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products (public catalog)
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  product_url text not null,
  image_urls text[] not null default '{}',
  category text not null,
  subcategory text,
  available_sizes text[] not null default '{}',
  sizing_system text,
  price numeric not null,
  original_price numeric,
  currency text not null default 'USD',
  color text,
  material text,
  designer_id text references public.designers(id) on delete set null,
  designer_city text,
  aesthetic_tags text[] not null default '{}',
  presentation_tags text[] not null default '{}',
  occasion_tags text[] not null default '{}',
  climate_tags text[] not null default '{}',
  department_tags text[] not null default '{}',
  inventory_status text not null default 'in-stock',
  made_to_order boolean not null default false,
  shipping_destinations text[] not null default '{}',
  condition text not null default 'new',
  is_independent_designer boolean not null default false,
  is_emerging_designer boolean not null default false,
  is_reference_example boolean not null default false,
  purchase_flow text not null default 'direct',
  last_verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_designer_id_idx on public.products(designer_id);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_is_reference_idx on public.products(is_reference_example);

-- Lookbooks (user-owned)
create table if not exists public.lookbooks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  cover_image_url text not null default '',
  generated_at timestamptz not null default now(),
  occasion text,
  climate text,
  location text,
  price_range jsonb,
  aesthetic_tags text[] not null default '{}',
  visibility text not null default 'private',
  generation_method text not null default 'build',
  saved boolean not null default true,
  build_preferences jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lookbooks_user_id_idx on public.lookbooks(user_id);

-- Looks within lookbooks
create table if not exists public.looks (
  id text primary key,
  lookbook_id text not null references public.lookbooks(id) on delete cascade,
  title text not null,
  explanation text not null default '',
  total_estimated_price numeric not null default 0,
  currency text not null default 'USD',
  color_palette text[] not null default '{}',
  silhouette_tags text[] not null default '{}',
  occasion_tags text[] not null default '{}',
  styling_explanation text,
  match_explanation text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists looks_lookbook_id_idx on public.looks(lookbook_id);

-- Products per look (ordered)
create table if not exists public.look_products (
  look_id text not null references public.looks(id) on delete cascade,
  product_id text not null references public.products(id) on delete restrict,
  sort_order int not null default 0,
  primary key (look_id, product_id)
);

-- Archive collections
create table if not exists public.archive_collections (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  cover_image_url text,
  visibility text not null default 'private',
  created_at timestamptz not null default now()
);

-- Designer applications
create table if not exists public.designer_applications (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  designer_name text not null,
  label_name text not null,
  contact_email text not null,
  city text not null,
  country text not null,
  website text,
  instagram text,
  biography text not null,
  design_philosophy text,
  product_categories text[] not null default '{}',
  aesthetic_keywords text[] not null default '{}',
  price_range jsonb not null default '{}'::jsonb,
  size_range text not null default '',
  custom_sizing boolean not null default false,
  made_to_order boolean not null default false,
  shipping_regions text[] not null default '{}',
  connection_type text not null default 'manual',
  status text not null default 'submitted',
  submitted_at timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, auth_provider, is_guest)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'auth_provider', 'email'),
    false
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.designers enable row level security;
alter table public.products enable row level security;
alter table public.lookbooks enable row level security;
alter table public.looks enable row level security;
alter table public.look_products enable row level security;
alter table public.archive_collections enable row level security;
alter table public.designer_applications enable row level security;

-- Profiles: own row only
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Catalog: public read
create policy "designers_public_read" on public.designers for select using (true);
create policy "products_public_read" on public.products for select using (true);

-- Lookbooks: own rows
create policy "lookbooks_select_own" on public.lookbooks for select using (auth.uid() = user_id);
create policy "lookbooks_insert_own" on public.lookbooks for insert with check (auth.uid() = user_id);
create policy "lookbooks_update_own" on public.lookbooks for update using (auth.uid() = user_id);
create policy "lookbooks_delete_own" on public.lookbooks for delete using (auth.uid() = user_id);

-- Looks: via lookbook ownership
create policy "looks_select_own" on public.looks for select using (
  exists (select 1 from public.lookbooks lb where lb.id = lookbook_id and lb.user_id = auth.uid())
);
create policy "looks_insert_own" on public.looks for insert with check (
  exists (select 1 from public.lookbooks lb where lb.id = lookbook_id and lb.user_id = auth.uid())
);
create policy "looks_delete_own" on public.looks for delete using (
  exists (select 1 from public.lookbooks lb where lb.id = lookbook_id and lb.user_id = auth.uid())
);

-- Look products: via look ownership
create policy "look_products_select_own" on public.look_products for select using (
  exists (
    select 1 from public.looks l
    join public.lookbooks lb on lb.id = l.lookbook_id
    where l.id = look_id and lb.user_id = auth.uid()
  )
);
create policy "look_products_insert_own" on public.look_products for insert with check (
  exists (
    select 1 from public.looks l
    join public.lookbooks lb on lb.id = l.lookbook_id
    where l.id = look_id and lb.user_id = auth.uid()
  )
);

-- Collections: own rows
create policy "collections_select_own" on public.archive_collections for select using (auth.uid() = user_id);
create policy "collections_insert_own" on public.archive_collections for insert with check (auth.uid() = user_id);
create policy "collections_update_own" on public.archive_collections for update using (auth.uid() = user_id);
create policy "collections_delete_own" on public.archive_collections for delete using (auth.uid() = user_id);

-- Designer applications: own rows
create policy "applications_select_own" on public.designer_applications for select using (auth.uid() = user_id);
create policy "applications_insert_own" on public.designer_applications for insert with check (auth.uid() = user_id);
