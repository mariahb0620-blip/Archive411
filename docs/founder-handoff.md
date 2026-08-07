# Founder handoff — Archive411 private beta

Live walkthrough script for beta approval. Production deploy only after this review passes.

## Pre-demo checklist

- [ ] Supabase tables created (`001_initial_schema.sql`)
- [ ] Catalog seeded: `npm run catalog:seed` → 8 designers, 20 products
- [ ] Email confirmation **disabled** in Supabase Auth
- [ ] Preview URL added to Supabase redirect URLs
- [ ] `npm run beta:test` passes locally

**Preview deploy:** https://archive411-ofhv1jwff-mariahb0620-6565s-projects.vercel.app  
(Vercel deployment protection may require team login — share inspector link with founder if needed.)

## Demo flow (~15 minutes)

### 1. Intro → Auth

1. Open `/intro` — brand story and beta positioning
2. Continue to `/auth`
3. **Sign up** with test email + password (8+ chars)
4. Confirm immediate access (no email confirmation step)
5. Note: Google shows **Coming soon** (disabled)

### 2. Build My Look

1. Go to `/build`
2. Complete questionnaire:
   - Style: Y2K / hot-girl-y2k
   - Presentation: Feminine
   - Sizes, location, footwear
3. Submit → loading state → lookbook results
4. Verify product links open real designer URLs (no `example.com`)
5. Repeat with **streetwear / masculine** profile — results should differ

### 3. Lookbook detail

1. Open a generated lookbook
2. Click product cards → valid retailer/designer URLs
3. Test **Replace item** on one product
4. **Save to Archive**

### 4. My Archive persistence

1. Go to `/archive` — saved lookbook visible
2. **Refresh page** — lookbook still there (Supabase, not local-only)
3. Optional: second browser/device, same account → same Archive

### 5. Guest migration

1. Sign out → continue as guest
2. Build a lookbook → save to Archive (local)
3. Sign up with new account
4. Guest lookbooks migrate to account Archive

## What is real vs mocked

| Feature | Status |
|---------|--------|
| Email auth | Real (Supabase) |
| My Archive | Real (Supabase + RLS) |
| Build My Look recommendations | Real (verified catalog scoring) |
| Product links | Real URLs from beta catalog |
| Google OAuth | Deferred |
| Collections page | Not built |
| Designer dashboard | Placeholder |
| `/api/generate` | Legacy mock — not primary path |

## Approval gates

- [ ] Questionnaire inputs change results
- [ ] Archive survives refresh
- [ ] Cross-device sync works (same account)
- [ ] Mobile layout usable (Safari / Chrome)
- [ ] No broken primary-path buttons

## After approval

1. Promote Vercel preview → production
2. Set `NEXT_PUBLIC_APP_URL` to production domain
3. Add production URL to Supabase redirect URLs
4. Rotate Supabase secret key if not already done
5. Share beta tester invite list

## Rollback

See [deployment.md](./deployment.md) — promote previous Vercel deployment; database migrations are additive.
