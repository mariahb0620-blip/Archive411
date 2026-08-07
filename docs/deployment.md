# Deployment

## Vercel preview (deployed)

**Preview URL:** https://archive411-ofhv1jwff-mariahb0620-6565s-projects.vercel.app

**Inspector:** https://vercel.com/mariahb0620-6565s-projects/archive411/Da8q3qYjqW4kHjiAteAwCh5hR8th

Deploy protection may require Vercel team login for external testers. See [vercel-preview.md](./vercel-preview.md).

## Vercel

1. Connect GitHub repository to Vercel
2. Set environment variables (all environments):

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_APP_URL` | Yes | e.g. `https://archive411.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Preview/Prod | Server-only; for seed script |
| `NEXT_PUBLIC_BETA_FEEDBACK_URL` | No | Google Form or Tally |
| Affiliate vars | No | Rakuten / Impact when ready |

3. Run Supabase migration SQL in each environment's project
4. Seed catalog: `npm run catalog:seed` (with service role key)
5. Deploy preview branch → founder review → promote to production

## Supabase auth settings (beta)

- Enable Email provider
- **Disable email confirmation** for private beta testers (or use invite-only)
- Google OAuth: deferred — do not enable until founder approval

## Pre-deploy checklist

```bash
npm run build
npm run lint
npm run catalog:verify
```

## Rollback

1. In Vercel: Deployments → select previous successful deployment → Promote to Production
2. Database: migrations are additive; rollback SQL only if a migration caused issues
3. Re-run `catalog:seed` if catalog data was corrupted

## Local development without Supabase

The app falls back to:
- Local device storage for auth and Archive
- `app/data/betaCatalog.ts` for recommendations

Set Supabase env vars to enable full cross-device persistence.
