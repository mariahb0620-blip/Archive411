# API contracts

Structured JSON only — the UI never parses AI prose for product composition.

## POST `/api/recommendations/build`

Generate a lookbook from Build My Look answers.

**Request body:** `BuildLookAnswers` (see `app/types/domain.ts`)

**Response:**
```json
{
  "lookbook": { "id": "lb-...", "title": "...", "coverImageUrl": "...", "generationMethod": "build", "saved": false, "collectionIds": [], "aestheticTags": [], "visibility": "private", "generatedAt": "..." },
  "looks": [{ "id": "look-...", "lookbookId": "...", "title": "...", "productIds": ["beta-guzio-mini-dress"], "explanation": "...", "totalEstimatedPrice": 500, "currency": "USD", "colorPalette": [], "silhouetteTags": [], "occasionTags": [] }],
  "products": [{ "id": "beta-guzio-mini-dress", "name": "...", "productUrl": "https://guzio.nyc/...", "price": 198, "currency": "USD" }],
  "designers": [],
  "empty": false,
  "message": null
}
```

When inventory is weak, `empty: true` or fewer `looks` — products are never fabricated.

## GET `/api/lookbooks`

Requires authenticated Supabase session.

**Response:** `{ "lookbooks": Lookbook[] }`

## POST `/api/lookbooks`

Save a lookbook to the user's Archive.

**Request:**
```json
{
  "lookbook": { "id": "lb-...", "title": "...", "coverImageUrl": "..." },
  "looks": [{ "id": "look-...", "productIds": ["..."] }],
  "method": "build",
  "buildPreferences": {}
}
```

**Response:** `{ "ok": true, "lookbook": { ... } }`

## GET `/api/lookbooks/[id]`

Fetch saved lookbook with looks and hydrated products.

**Response:** `{ "lookbook": {}, "looks": [], "products": [] }`

## GET `/api/products/search`

Query params: `q`, `city`, `independent=true`

**Response:** `{ "products": Product[], "total": number }`

## POST `/api/products/replace`

Find an alternative product in the same category.

**Request:** `{ "category": "tops", "excludeIds": ["..."], "answers": {} }`

**Response:** `{ "product": Product | null, "message"?: string }`

## POST `/api/affiliate`

Existing affiliate redirect builder — unchanged.
