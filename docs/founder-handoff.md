# Founder handoff — Archive411 private beta

Live walkthrough script for beta approval. Production deploy only after this review passes.

## Pre-demo checklist

- [x] Supabase tables created (`001_initial_schema.sql`)
- [x] Archive features migration applied (`002_archive_features.sql`)
- [x] Catalog seeded: `npm run catalog:seed` → **32 designers, 44 products** (verified in Supabase)
- [ ] Email confirmation **disabled** in Supabase Auth
- [ ] Google OAuth provider **enabled** in Supabase Auth (optional for demo — email works without it)
- [ ] Preview URL added to Supabase redirect URLs
- [ ] `npm run catalog:verify` passes locally
- [ ] `npm run beta:test` passes locally

**Preview deploy:** check latest Vercel deployment for the `main` branch.  
(Vercel deployment protection may require team login — share inspector link with founder if needed.)

## Demo flow (~20 minutes)

### 1. Intro → Auth

1. Open `/intro` — brand story and beta positioning
2. Continue to `/auth`
3. **Sign up** with test email + password (8+ chars)
4. Confirm immediate access (no email confirmation step)
5. Optional: **Continue with Google** — works when Google provider is enabled in Supabase Dashboard + redirect URLs configured

### 2. Build My Look

1. Go to `/build` (or Create tab → Build My Look)
2. Complete questionnaire:
   - Style: Y2K / hot-girl-y2k
   - Optional **Style Inspiration** chips (cultural communities — opt-in only)
   - Presentation: Feminine
   - Sizes, location, footwear
3. Submit → loading state → lookbook results
4. Verify product links open real designer URLs (no `example.com`)
5. Repeat with **streetwear / masculine** profile — results should differ

### 3. Search & Surprise

1. Go to `/search` — structured search from the same verified catalog
2. Try `/surprise` — random look from verified pool (no mock products)
3. Confirm product cards use category PNG placeholders (authorized SKU imagery is a launch gate)

### 4. Lookbook detail

1. Open a generated lookbook
2. Click product cards → valid retailer/designer URLs
3. Test **Replace item** on one product
4. **Save to Archive**

### 5. My Archive & Collections

1. Go to `/archive` — saved lookbook visible
2. **Refresh page** — lookbook still there (Supabase, not local-only)
3. Go to `/collections` — create a collection (requires signed-in account + migration 002)
4. Optional: second browser/device, same account → same Archive

### 6. Designers & designer portal

1. Browse `/designers` — 32 verified independent labels
2. Open a designer profile — real website / social links
3. Optional: `/for-designers` → apply → `/designer/dashboard` shows application status (shell dashboard)

### 7. Guest migration

1. Sign out → continue as guest
2. Build a lookbook → save to Archive (local)
3. Sign up with new account
4. Guest lookbooks migrate to account Archive

## What is real vs mocked

| Feature | Status |
|---------|--------|
| Email auth | Real (Supabase) |
| Google OAuth | Wired — enable provider in Supabase Dashboard |
| My Archive | Real (Supabase + RLS) |
| Collections | Real (`/collections` + Supabase, migration 002) |
| Saved designers API | Real (migration 002) |
| Build My Look recommendations | Real (32 designers / 44 products, verified scoring) |
| Search / Surprise | Real (verified catalog via API) |
| Product links | Real URLs from verified catalog |
| Product images | Category PNG placeholders (not authorized SKU photos) |
| Designer dashboard | Shell — application status + roadmap sections |
| Quick Generate (`/generate`) | Coming soon — use Build My Look |
| `/api/generate` | Legacy mock — not primary path |
| Affiliate product feeds | URL builder only — no feed ingestion yet |

## Approval gates

- [ ] Questionnaire inputs change results
- [ ] Archive survives refresh
- [ ] Cross-device sync works (same account)
- [ ] Mobile layout usable (Safari / Chrome)
- [ ] No broken primary-path buttons
- [ ] Search and Surprise return real catalog products

## After approval

1. Promote Vercel preview → production
2. Set `NEXT_PUBLIC_APP_URL` to production domain
3. Add production URL to Supabase redirect URLs
4. Enable Google OAuth redirect URLs for production
5. Rotate Supabase secret key if not already done
6. Share beta tester invite list

## Rollback

See [deployment.md](./deployment.md) — promote previous Vercel deployment; database migrations are additive.

## Reference

- Catalog verification: `npm run catalog:verify`
- Known limitations: [known-issues.md](./known-issues.md)
- Completion summary: [completion-report.md](./completion-report.md)
