# Recommendation logic

Server-side structured scoring — no LLM product invention.

## Entry point

`POST /api/recommendations/build` → `lib/recommendations/buildLookbook.ts` → `generateLookbookFromBuildForPool()`

## Product pool

1. Supabase `products` where `is_reference_example = false` (when configured)
2. Fallback: `app/data/betaCatalog.ts` (20 verified products)

## Filtering & scoring

Ported from `app/services/catalog.service.ts`:

| Input | Effect |
|-------|--------|
| Style directions | Mapped to aesthetic tags via `STYLE_TO_AESTHETIC` |
| Fashion communities | Opt-in only; adds community aesthetics |
| Presentation | `scorePresentationMatch()` |
| Department | Derived from presentation via `resolveDepartmentFromBuild()` |
| Sizes | `checkSizeAvailability()` — unavailable sizes penalized |
| Budget | Price tier / custom max in USD |
| Location / climate | Tag and city matching |
| Coverage level | Revealing vs modest tag scoring |
| Independent designers | Boost independent/emerging; penalize non-independent when `independentOnly` |
| Footwear inclusion = no | Shoes excluded from pool |

## Outfit assembly

1. `assembleDiverseLook()` — picks diverse sources (top, bottom, shoes, accessory)
2. `searchCatalog()` — ranked fallback pool
3. `assembleVariedLookbook()` — builds multiple looks with category requirements from `LOOK_INTERPRETATIONS`

## Empty results policy

- Return zero looks rather than fabricate products
- UI shows honest "limited matches" / "no matches" messaging
- `empty: true` in API response when no verified products match

## Item replacement

`POST /api/products/replace` — random alternative in same category from verified pool, excluding current look product IDs.
