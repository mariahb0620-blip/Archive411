# Archive411

Mobile-first fashion intelligence and personal lookbook platform — private beta.

## Quick start

```bash
npm install
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SUPABASE_DB_PASSWORD=...   # Dashboard → Settings → Database
```

Then:

```bash
npm run db:migrate      # create tables (or use SQL Editor)
npm run catalog:seed      # load verified beta catalog
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run catalog:verify` | Validate beta catalog (must pass before deploy) |
| `npm run catalog:seed` | Seed Supabase with verified catalog (requires service role key) |
| `npm run beta:test` | End-to-end auth + build + archive smoke test |
| `npm run e2e:test` | Playwright smoke tests (requires `npx playwright install`) |
| `npm run cap:sync` | Sync Capacitor native shells |

## Documentation

- [Architecture & route map](docs/architecture.md)
- [Database schema](docs/database.md)
- [API contracts](docs/api.md)
- [Deployment](docs/deployment.md)
- [Testing checklist](docs/testing.md)
- [Known issues](docs/known-issues.md)
- [Recommendation logic](docs/recommendation-logic.md)
- [Founder handoff](docs/founder-handoff.md)
- [Completion report](docs/completion-report.md)
- [Catalog sources](docs/catalog-sources.md)
- [Launch checklist](docs/launch-checklist.md)

## Beta user journey

1. Two-slide intro → auth (email + password or guest)
2. Build My Look questionnaire → structured lookbook from verified catalog
3. Save to My Archive → persists via Supabase (or localStorage for guest)
4. Guest → account migration on sign-up

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind · Framer Motion · Supabase · Vercel
