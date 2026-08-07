# Testing checklist

Manual QA for private beta acceptance.

## Build & lint

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npm run catalog:verify` passes

## Auth

- [ ] Create account with email + password
- [ ] Sign in with existing account
- [ ] Sign out clears session
- [ ] Guest mode works without account
- [ ] Google button shows "Coming soon" and is disabled
- [ ] Guest lookbooks migrate after creating account (with Supabase configured)

## Build My Look

- [ ] Complete all questionnaire steps (style, presentation, sizes, context, footwear)
- [ ] Loading state shows during generation
- [ ] Lookbook displays with real designer links (no example.com)
- [ ] Different profiles produce visibly different products
- [ ] Empty/no-match state when inventory cannot satisfy preferences

## My Archive

- [ ] Save lookbook from detail page
- [ ] Lookbook appears in `/archive`
- [ ] Refresh page — lookbook still visible
- [ ] Second device/browser with same account shows same Archive (Supabase)

## Product detail

- [ ] Sold-out / size unavailable badges display correctly
- [ ] Replace item returns alternative from same category
- [ ] Product links open valid retailer/designer URLs

## Mobile & desktop

- [ ] iOS Safari — full journey
- [ ] Android Chrome — full journey
- [ ] Desktop Chrome — full journey

## Dead buttons

- [ ] Quick Generate in Create menu is non-clickable
- [ ] Save / Follow designer buttons disabled on designer profiles
- [ ] Designer dashboard sections labeled "Coming soon"
- [ ] No undocumented mock flows in primary tester path
