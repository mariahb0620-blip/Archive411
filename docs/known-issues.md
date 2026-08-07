# Known issues & technical debt

## Beta limitations

- **Catalog size:** 32 verified designers / 44 products (8 beta core + 22 extended). Concepts PDF roster partially ingested.
- **Product images:** Category PNG placeholders until authorized SKU imagery is ingested.
- **Quick Generate / Results:** Redirect to Build My Look (`/generate`, `/results` → `/build`).
- **Fitting lists API:** Ready; showroom pages still reference seed data.
- **Affiliate feeds:** SSENSE/Farfetch URL builder only — no product feed ingestion.
- **Capacitor native:** Scripts present; device validation recommended before App Store submit.

## Resolved in latest pass

- Search/Surprise/Independent now use verified catalog pool (no MOCK_PRODUCTS default).
- Google OAuth wired — enable provider in Supabase Dashboard.
- Collections, saved designers, fitting lists APIs added (migration 002 required).
- Style inspiration opt-in step in Build questionnaire.

## Technical debt

- `beta:test` API HTTP checks require running server matching latest build
- Guest migration not in automated test suite

## Migrations

Run in Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_archive_features.sql`

Then: `npm run catalog:seed`
