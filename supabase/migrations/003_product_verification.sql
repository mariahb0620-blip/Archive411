-- Product verification & catalog pipeline fields (backwards-compatible)

alter table public.products
  add column if not exists source_url text,
  add column if not exists source_type text default 'manual',
  add column if not exists source_product_id text,
  add column if not exists retailer_name text,
  add column if not exists designer_name text,
  add column if not exists image_source text default 'unknown',
  add column if not exists style_tags text[] not null default '{}',
  add column if not exists season_tags text[] not null default '{}',
  add column if not exists color_tags text[] not null default '{}',
  add column if not exists footwear_type text,
  add column if not exists heel_height text,
  add column if not exists verified boolean default false,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists verified_at timestamptz,
  add column if not exists last_checked_at timestamptz,
  add column if not exists verification_method text,
  add column if not exists affiliate_url text,
  add column if not exists affiliate_network text,
  add column if not exists stock_status text;

create index if not exists products_verification_status_idx
  on public.products (verification_status);

create index if not exists products_verified_idx
  on public.products (verified);

comment on column public.products.verification_status is
  'pending | verified | unavailable | broken_url | homepage_redirect | missing_data | manual_review';
