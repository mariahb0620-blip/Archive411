# Public launch checklist

Gates before promoting beyond private beta.

## Data integrity

- [ ] `npm run catalog:verify` passes on production branch
- [ ] Zero `example.com` URLs in verified catalog
- [ ] All designer URLs manually verified within 30 days
- [ ] `docs/catalog-sources.md` authorization records complete

## Imagery

- [ ] Authorized SKU images ingested OR placeholders clearly labeled
- [ ] No Unsplash / AI model imagery on product cards

## Auth & security

- [ ] Supabase secret key rotated if ever shared
- [ ] Google OAuth redirect URLs include production domain
- [ ] RLS policies verified — users cannot read others' archives

## Inclusive UX audit

- [ ] Cultural communities are opt-in only
- [ ] No problematic sizing language (normal, hide, fix, dress for your age)
- [ ] Complexion/body questions remain optional

## Infrastructure

- [ ] Migration `002_archive_features.sql` applied
- [ ] CI green on main branch
- [ ] E2E smoke test passes
- [ ] Rollback procedure documented (`docs/deployment.md`)

## Founder sign-off

- [ ] Second acceptance pass beyond private beta
- [ ] Beta tester feedback reviewed
- [ ] Production URL set in `NEXT_PUBLIC_APP_URL`
