# Catalog import

Add verified products as JSON batches. Each record must use an **exact product URL** (`/products/...` or `/product/...`), not a designer homepage.

## Workflow

```bash
# 1. Add batch file (do not edit verified-products.json by hand)
#    data/catalog/import/batch-my-label.json

# 2. Dry run
npm run catalog:import -- --dry-run data/catalog/import/batch-my-label.json

# 3. Merge into local pool + optional Supabase upsert
npm run catalog:import -- data/catalog/import/batch-my-label.json

# 4. Re-seed Supabase full catalog
npm run catalog:seed

# 5. Check coverage
npm run catalog:coverage
```

Optional OpenAI tag enrichment on import (verified only):

```bash
npm run catalog:import -- --enrich-tags data/catalog/import/batch-my-label.json
```

Sample enrichment without catalog writes:

```bash
npm run catalog:enrich-sample -- --limit=3
npm run catalog:enrich-sample -- --report
```

## Files

| File | Purpose |
|------|---------|
| `batch-*.json` | Input batches (your new products) |
| `example-record.json` | Annotated template — not imported automatically |
| `verified-products.json` | Merged verified pool (updated by import script) |
| `enrichment-reviews/` | Optional `--report` output (gitignored) |

## Record schema

Required fields:

- `productName` — exact name from retailer page
- `productUrl` — exact SKU page (HTTPS)
- `price`, `currency`
- `category` — `tops`, `bottoms`, `dresses`, `shoes`, `outerwear`, `handbags`, etc.
- `designerId` — must match a designer in `betaCatalog.ts` or `extendedCatalog.ts`
- `presentationTags`, `occasionTags` — arrays for recommendation scoring

Optional: `id`, `subcategory`, `availableSizes`, `imageUrl`, `imageSource`, `aestheticTags`, `climateTags`, `departmentTags`, `styleTags`, `colorTags`.

See [`example-record.json`](./example-record.json) and [`lib/catalog/types.ts`](../../../lib/catalog/types.ts) (`ImportProductRecord`).

## Rules

- No fabricated URLs, prices, or images
- Homepage/collection URLs are rejected (`verification_status: homepage_redirect`)
- OpenAI does **not** verify product existence — manual/Rakuten source only
- Import merges into [`verified-products.json`](./verified-products.json) and [`lib/catalog/verifiedPool.ts`](../../../lib/catalog/verifiedPool.ts)
