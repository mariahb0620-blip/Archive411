# Catalog Pipeline

Archive411 uses a **verified product catalog pipeline** so only real, shoppable SKUs enter recommendations.

## Architecture

```
data/catalog/import/*.json  ─┐
betaCatalog.ts / extended   ─┼─► normalize ─► verifyProduct ─► isRecommendationEligible ─► recommendations
Rakuten provider (optional) ─┘         │                              │
                                         └─► Supabase upsert (seed/import)
```

## Product lifecycle

1. **Ingest** — JSON import (`npm run catalog:import`), manual TS seed, or Rakuten feed (when credentials exist).
2. **Normalize** — Map to `Product` model with source metadata.
3. **Verify** — Static + optional HTTP checks (`lib/catalog/verifyProduct.ts`). OpenAI does **not** determine existence.
4. **Eligibility** — `isRecommendationEligible()` gates Build, Search, and Surprise pools.
5. **Publish** — Upsert to Supabase via `npm run catalog:seed` or import.

## Verification statuses

| Status | Meaning |
|--------|---------|
| `pending` | Not yet checked |
| `verified` | Exact product URL + required metadata |
| `homepage_redirect` | Designer homepage / browse URL — **not shoppable** |
| `broken_url` | Dead or invalid link |
| `unavailable` | Sold out / removed at source |
| `missing_data` | Missing price, tags, designer, etc. |
| `manual_review` | Needs human review |

## Recommendation eligibility

A product is shoppable when:

- `verification_status === verified`
- Product-specific URL (`/products/` or `/product/`)
- Valid designer, category, price, tags
- Not sold out
- No stock/AI imagery

Extended roster products (homepage URLs) remain in the catalog for designer discovery but are **excluded** from look generation.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run catalog:verify` | Static + flow regression checks |
| `npm run catalog:verify-links` | Live HTTP link checks (beta strict) |
| `npm run catalog:coverage` | Occasion × presentation × category gaps |
| `npm run catalog:stale` | Products not rechecked within `VERIFICATION_MAX_AGE_DAYS` |
| `npm run catalog:import` | JSON/CSV-style curated import |
| `npm run catalog:pipeline-test` | Eligibility + diversity unit checks |
| `npm run catalog:seed` | Upsert local catalog to Supabase |

## Designer URL vs product URL

- **Shop product** → exact SKU page (`product_url` / affiliate destination)
- **View designer** → designer profile / homepage (separate link in UI)

Never use designer homepages for **Shop now**.

## Migrations

Apply `supabase/migrations/003_product_verification.sql` before seeding new fields:

```bash
npm run db:migrate
```

## Current scale (local seed)

- ~32 designers, ~42 total products
- ~18 recommendation-eligible beta SKUs with exact URLs
- ~24 extended browse-only reference pieces (excluded from shoppable looks)

Target for private beta: **150–250 verified products** added via gap-driven import, not arbitrary count inflation.
