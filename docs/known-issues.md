# Known issues & technical debt

## Beta limitations

- **Catalog size:** 32 designers / 42 products (18 shoppable beta SKUs + 24 extended browse-only). Target 150–250 verified products for 10-user beta.
- **Product images:** Category PNG placeholders (`image_source: category_placeholder`) — not authorized SKU photography. Import pipeline ready for real retailer images.
- **Extended roster:** 24 products use designer homepages — excluded from shoppable recommendations until exact SKU URLs are verified.
- **Affiliate feeds:** Rakuten provider scaffolded; credentials required for ingestion. Impact URL builder exists — no product feed yet.
- **Capacitor native:** Scripts present; device validation recommended before App Store submit.

## Catalog pipeline (new)

- `npm run catalog:coverage` — gap report by occasion/presentation/category
- `npm run catalog:stale` — verification recheck window
- `npm run catalog:import` — JSON import with verify gate
- Migration `003_product_verification.sql` required before seeding new fields

## Resolved in latest pass

- Recommendation engine uses `isRecommendationEligible()` — homepage URLs never appear in Shop now
- Extended catalog excluded from look generation (designer profiles still browsable)
- OpenAI removed as verification source of truth (advisory warn-only in link checks)
- Designer diversity caps per look / lookbook

## Technical debt

- `beta:test` API HTTP checks require running server matching latest build
- Guest migration not in automated test suite
- Authorized product photography pending Mariah/Rakuten/manual import

## Migrations

Run in Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_archive_features.sql`
3. `supabase/migrations/003_product_verification.sql`

Then: `npm run catalog:seed`

See [catalog-pipeline.md](./catalog-pipeline.md) and [catalog-gap-report.md](./catalog-gap-report.md).
