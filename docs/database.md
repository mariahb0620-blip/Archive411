# Database

Schema lives in [`supabase/migrations/001_initial_schema.sql`](../supabase/migrations/001_initial_schema.sql).

## Tables

| Table | Access |
|-------|--------|
| `profiles` | User owns row (`auth.uid() = id`) |
| `designers` | Public read |
| `products` | Public read; `is_reference_example = false` for recommendations |
| `lookbooks` | User owns row |
| `looks` | Via lookbook ownership |
| `look_products` | Via look ownership |
| `archive_collections` | User owns row |
| `designer_applications` | User owns row |

## RLS summary

- Catalog tables: `SELECT` for all authenticated and anonymous users
- User data: `SELECT/INSERT/UPDATE/DELETE` only when `auth.uid() = user_id`
- Looks and look_products: policies join through `lookbooks.user_id`

## Profile trigger

`handle_new_user()` creates a `profiles` row on `auth.users` insert.

## Seeding

```bash
# 1. Apply migration (requires SUPABASE_DB_PASSWORD in .env.local)
npm run db:migrate

# Or paste supabase/migrations/001_initial_schema.sql into Supabase SQL Editor

# 2. Seed verified catalog
npm run catalog:seed
```

Requires `SUPABASE_SERVICE_ROLE_KEY` in environment.

## Environments

Configure separate Supabase projects (or branches) for development, Vercel preview, and production.
