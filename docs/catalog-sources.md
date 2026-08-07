# Catalog sources and limitations

Verified designers in the Archive411 catalog. All URLs checked manually; no `example.com` in production paths.

## Beta core (8 designers, 20 products)

| Designer | City | Website | Status |
|----------|------|---------|--------|
| GUAPÉ Studio | London | https://guapestudio.com/ | Verified |
| Telfar | New York | https://telfar.net/ | Verified |
| Salomon | Annecy | https://www.salomon.com/ | Verified |
| Collina Strada | New York | https://collinastrada.com/ | Verified |
| Martine Rose | London | https://martine-rose.com/ | Verified |
| Wales Bonner | London | https://walesbonner.com/ | Verified |
| El Dantés | Mexico City | https://eldantes.com/ | Verified |
| GUZIO | New York | https://guzio.nyc/ | Verified |

## Extended roster (22 designers, 1 signature product each)

See [`app/data/extendedCatalog.ts`](../app/data/extendedCatalog.ts) for full list including Luar, Sandy Liang, Mowalola, Marine Serre, Jacquemus, Sretsis, Needles, AMBUSH, and others from the Concepts PDF.

## Data limitations

- **Product imagery:** Category PNG placeholders until authorized SKU photography is ingested.
- **Inventory:** Static seed data; not live Shopify/API feeds yet.
- **Reference examples:** Legacy seed with `is_reference_example=true` excluded from recommendations.
- **Affiliate retailers:** SSENSE, Farfetch — URL builder only; no product feed connected.

## Verification

```bash
npm run catalog:verify   # URL + field validation
npm run catalog:seed     # Upsert to Supabase
```

## Authorization policy

Production catalog entries must be:
1. Real public designer/retailer URLs, or
2. Clearly labeled development placeholders (`is_reference_example`).

Do not fabricate prices, sizes, or partnerships.
