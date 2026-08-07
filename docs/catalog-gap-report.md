# Catalog Gap Report (Phase 1 Audit)

Generated during verified catalog pipeline implementation.

## Current counts

| Metric | Count |
|--------|-------|
| Designers | 32 |
| Total products | 42 |
| Beta (exact SKU URLs) | 18 |
| Extended (homepage URLs) | 24 |
| Recommendation-eligible | 18 |
| Category placeholder images | 42/42 |

## Field coverage

**Present:** id, name, productUrl, price, currency, category, tags, designerId, inventoryStatus, lastVerifiedAt

**Added (migration 003):** source_url, source_type, verification_status, verified_at, last_checked_at, image_source, affiliate fields, style/season/color tags

**Still sparse:** authorized SKU photography, live inventory sync, retailer/concept-store IDs

## Gaps vs beta target

### Occasion coverage (eligible products only)

Most eligible SKUs tag `event`, `weekend`, `everyday`. Shortages:

- **Date night** — ~4 tagged; need dresses, heels, bags
- **Work** — ~4 tagged; need polished tops, trousers, loafers
- **Nightlife** — limited evening footwear
- **Travel / climate-specific** — minimal dedicated tags

### Category shortages

- **Shoes** — 2 eligible (need sneakers, heels, boots, flats, sandals)
- **Handbags** — 2 eligible
- **Jewelry/accessories** — 1–2 eligible
- **Knitwear, outerwear** — thin for cold-weather work/date looks

### Presentation

- Strong androgynous/feminine tag overlap
- Masculine-specific inventory limited (~8 tag occurrences total)

### Price bands (eligible)

Heavy mid-tier ($250–500). Need more $0–200 and $500+ for budget questionnaire tiers.

## Homepage / link issues

- 24/42 products use designer `website` as `productUrl` → `homepage_redirect`, excluded from recommendations
- 0 example.com links
- 18/18 beta URLs are product-specific paths

## Image policy

All seed products use `/images/catalog/product-*.png` category illustrations (`image_source: category_placeholder`). Real retailer/Rakuten imagery should replace these as products are verified and imported.

## Rakuten

Scaffold at `lib/catalog/providers/rakuten.ts`. Requires `RAKUTEN_ACCESS_TOKEN` + `RAKUTEN_AFFILIATE_ID`. Missing credentials do not break the app.

## Next expansion priorities

1. Date night × feminine — dresses, heels, bags
2. Work × masculine/feminine — shirts, trousers, outerwear
3. Footwear diversity across occasions
4. Warm/cold climate tagged pieces
5. Import verified SKUs via `data/catalog/import/*.json` — never fabricate URLs
