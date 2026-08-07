# Catalog sources and limitations

Verified designers in the Archive411 catalog. All URLs checked manually; no `example.com` in production paths.

## Beta core (8 designers, 18 products — all shoppable)

| Designer | City | Website | Status |
|----------|------|---------|--------|
| GUAPÉ Studio | London | https://guapestudio.com/ | Verified SKU URLs |
| Telfar | New York | https://telfar.net/ | Verified SKU URLs |
| Salomon | Annecy | https://www.salomon.com/ | Verified SKU URLs |
| Collina Strada | New York | https://collinastrada.com/ | Verified SKU URLs |
| Martine Rose | London | https://martine-rose.com/ | Verified SKU URLs |
| Wales Bonner | London | https://walesbonner.com/ | Verified SKU URLs |
| GUZIO | New York | https://guzio.nyc/ | Verified SKU URLs |

El Dantés is listed as a featured designer but has no shoppable SKU in catalog (site was unreachable).

## Extended roster (24 designers, 1 signature product each — browse-only)

See [`app/data/extendedCatalog.ts`](../app/data/extendedCatalog.ts). These use designer homepages (`verification_status: homepage_redirect`) and are **excluded from shoppable recommendations** until exact product URLs are imported.

## Data limitations

- **Product imagery:** Category PNG placeholders until authorized SKU photography is ingested.
- **Inventory:** Static seed data; not live Shopify/API feeds yet.
- **Reference examples:** Legacy seed with `is_reference_example=true` excluded from recommendations.
- **Affiliate retailers:** SSENSE, Farfetch — URL builder only; no product feed connected.

## Verification

```bash
npm run catalog:verify        # Eligibility + flow regression
npm run catalog:verify-links  # Live HTTP check (OpenAI advisory only, never source of truth)
npm run catalog:coverage      # Occasion/presentation gap report
npm run catalog:stale         # Verification recheck report
npm run catalog:import        # JSON curated import
npm run catalog:discover-shopify  # List Shopify /products/ URLs for catalog maintenance
npm run catalog:seed          # Upsert to Supabase (after migration 003)
```

See [catalog-pipeline.md](./catalog-pipeline.md).

## Authorization policy

Production catalog entries must be:
1. Real public designer/retailer URLs, or
2. Clearly labeled development placeholders (`is_reference_example`).

Do not fabricate prices, sizes, or partnerships.
